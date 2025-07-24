import prisma from '../prisma/prismaClient';
import { Prisma } from '@prisma/client';

//Get all comments on a post by post ID
const getCommentsByPostId = async (postId: number, userId: number) => {
    const comments = await prisma.comment.findMany({
        where: { postId },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    profilePicture: true,
                },
            },
            commentLike: {
                where: { userId },
                select: {
                    id: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    const commentsWithIsLiked = comments.map((comment: any) => ({
        ...comment,
        commentLike: undefined,
        isLiked: comment.commentLike.length > 0,
    }));

    return commentsWithIsLiked;
};

//Comment on post by post ID
const commentOnPostById = async (
    userId: number,
    postId: number,
    content: string
) => {
    const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
            user: {
                select: {
                    id: true,
                    isPrivate: true,
                },
            },
        },
    });

    if (!post) {
        throw new Error('Post not found');
    }

    if (post.userId !== userId && post.user.isPrivate) {
        const isFollowing = await prisma.follow.findFirst({
            where: {
                followerId: userId,
                followingId: post.userId,
            },
        });
        if (!isFollowing) {
            throw new Error('You must follow the user to comment');
        }
    }

    const comment = await prisma.comment.create({
        data: {
            userId,
            postId,
            content,
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    profilePicture: true,
                },
            },
        },
    });

    await prisma.post.update({
        where: { id: postId },
        data: {
            commentsCount: {
                increment: 1,
            },
        },
    });

    return comment;
};
//Delete comment by comment ID
const deleteCommentById = async (commentId: number, userId: number) => {
    const comment = await prisma.comment.findUnique({
        where: { id: commentId },
    });
    if (!comment) {
        throw new Error('Comment not found');
    }
    if (comment.userId !== userId) {
        throw new Error('Unauthorized');
    }

    await prisma.comment.delete({
        where: { id: commentId },
    });
    await prisma.post.update({
        where: { id: comment.postId },
        data: {
            commentsCount: {
                decrement: 1,
            },
        },
    });
    return commentId;
};
//Like/Dislike a comment by comment Id
const toggleLikeComment = async (commentId: number, userId: number) => {
    const existingLike = await prisma.commentLike.findUnique({
        where: {
            userId_commentId: {
                userId,
                commentId,
            },
        },
    });

    if (existingLike) {
        await prisma.commentLike.delete({
            where: {
                userId_commentId: {
                    userId,
                    commentId,
                },
            },
        });

        await prisma.comment.update({
            where: { id: commentId },
            data: {
                likesCount: {
                    decrement: 1,
                },
            },
        });

        return { isLiked: false };
    } else {
        await prisma.commentLike.create({
            data: {
                userId,
                commentId,
            },
        });

        await prisma.comment.update({
            where: { id: commentId },
            data: {
                likesCount: {
                    increment: 1,
                },
            },
        });

        return { isLiked: true };
    }
};

export default {
    commentOnPostById,
    deleteCommentById,
    getCommentsByPostId,
    toggleLikeComment,
};
