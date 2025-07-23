import prisma from '../prisma/prismaClient';
import { Prisma } from '@prisma/client';
import {
    CreatePostInput,
    GetPostFeed,
    PostWithUserAndRelation,
    GetUserPosts,
} from '../types/postServices';
import { deleteImage } from '../utils/deleteImage';

// New Post
const createNewPost = async ({
    userId,
    imageUrl,
    caption,
}: CreatePostInput) => {
    const post = await prisma.post.create({
        data: { userId, imageUrl, caption },
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

    await prisma.user.update({
        where: { id: userId },
        data: {
            postsCount: {
                increment: 1,
            },
        },
    });

    return post;
};

// Get Post By id
const getPostById = async (postId: number, userId?: number) => {
    const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    profilePicture: true,
                },
            },
            comments: true,
            likes: userId ? { where: { userId: userId } } : false,
        },
    });
    if (!post) {
        throw new Error('Post not found');
    }

    return {
        id: post.id,
        userId: post.userId,
        caption: post.caption,
        imageUrl: post.imageUrl,
        likesCount: post.likesCount,
        commentsCount: post.comments.length,
        createdAt: post.createdAt,
        isLiked: userId ? post.likes.length > 0 : false,
        user: post.user,
    };
};

// Get User Feed
const getUserFeed = async ({ userId, page, limit }: GetPostFeed) => {
    const skip = (page - 1) * limit;
    // Query IDs userID follows.
    const followingUsers = await prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
    });
    const followingIds = followingUsers.map((f: any) => f.followingId);
    if (followingIds.length === 0) {
        return {
            posts: [],
            pagination: {
                page,
                limit,
                total: 0,
                total_pages: 0,
            },
        };
    }

    const [total, posts] = await Promise.all([
        prisma.post.count({
            where: {
                userId: { in: followingIds },
            },
        }),
        prisma.post.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            where: {
                userId: { in: followingIds },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        profilePicture: true,
                    },
                },
                likes: {
                    where: { userId },
                    select: { id: true },
                },
                comments: {
                    select: { id: true },
                },
            },
        }),
    ]);

    const formattedPosts = posts.map((post: PostWithUserAndRelation) => ({
        id: post.id,
        userId: post.userId,
        caption: post.caption,
        imageUrl: post.imageUrl,
        likesCount: post.likesCount,
        commentsCount: post.comments.length,
        createdAt: post.createdAt,
        isLiked: post.likes.length > 0,
        user: post.user,
    }));
    return {
        posts: formattedPosts,
        pagination: {
            page,
            limit,
            total,
            total_pages: Math.ceil(total / limit),
        },
    };
};

const getUserPosts = async ({
    userId,
    targetUserId,
    page,
    limit,
}: GetUserPosts) => {
    const skip = (page - 1) * limit;
    const targetUser = await prisma.user.findUnique({
        where: {
            id: targetUserId,
        },
        select: {
            isPrivate: true,
            followers: {
                where: { followerId: userId },
                select: {
                    id: true,
                },
            },
        },
    });
    if (!targetUser) {
        throw new Error('User not found');
    }
    const isFollowing = targetUser.followers.length > 0;
    if (targetUser.isPrivate && !isFollowing && userId !== targetUserId) {
        throw new Error('This profile is private');
    }
    const [total, posts] = await Promise.all([
        prisma.post.count({
            where: { userId: targetUserId },
        }),
        prisma.post.findMany({
            where: { userId: targetUserId },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        profilePicture: true,
                    },
                },
                likes: {
                    where: { userId: userId },
                    select: { id: true },
                },
                comments: {
                    select: { id: true },
                },
            },
        }),
    ]);
    const formattedPosts = posts.map((post: PostWithUserAndRelation) => ({
        id: post.id,
        userId: post.userId,
        caption: post.caption,
        imageUrl: post.imageUrl,
        likesCount: post.likesCount,
        commentsCount: post.comments.length,
        createdAt: post.createdAt,
        isLiked: post.likes.length > 0,
        user: post.user,
    }));

    return {
        posts: formattedPosts,
        pagination: {
            page,
            limit,
            total,
            total_pages: Math.ceil(total / limit),
        },
    };
};

const deletePostById = async (postId: number, userId: number) => {
    const post = await prisma.post.findUnique({
        where: { id: postId },
    });
    if (!post) {
        throw new Error('Post not found');
    }

    if (post.userId !== userId) {
        throw new Error('You have no permission to delete this post');
    }
    if (post.imageUrl) {
        await deleteImage(post.imageUrl);
    }

    await prisma.post.delete({
        where: { id: postId },
    });
};

export default {
    createNewPost,
    getUserFeed,
    getPostById,
    getUserPosts,
    deletePostById,
};
