import { Request, Response } from 'express';
import commentServices from '../services/commentServices';

//Get all comments on a post by post ID
const getCommentsByPostId = async (req: Request, res: Response) => {
    try {
        const postId = parseInt(req.params.id);
        const userId = req.userId;
        const skip = parseInt(req.query.skip as string) || 0;
        const take = parseInt(req.query.take as string) || 10;
        const comments = await commentServices.getCommentsByPostId(
            postId,
            userId,
            skip,
            take
        );
        return res.status(200).json({
            success: true,
            data: comments,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch comments',
        });
    }
};

//Comment on post by post ID
const commentOnPostById = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const postId = parseInt(req.params.id);
        const { content } = req.body;

        if (!content || content.trim().length === 0) {
            return res
                .status(400)
                .json({ success: false, message: 'Comment cannot be empty' });
        }

        const comment = await commentServices.commentOnPostById(
            userId,
            postId,
            content
        );
        return res.status(201).json({
            success: true,
            data: comment,
        });
    } catch (error: any) {
        const message = error.message;

        if (message === 'Post not found') {
            return res.status(404).json({ success: false, error: message });
        }

        if (message === 'You must follow the user to comment') {
            return res.status(403).json({ success: false, error: message });
        }

        return res.status(500).json({
            success: false,
            error: 'Error creating comment',
        });
    }
};
// Delete comment on post by comment ID
const deleteCommentById = async (req: Request, res: Response) => {
    try {
        const userid = req.userId;
        const commentId = parseInt(req.params.id);

        const result = await commentServices.deleteCommentById(
            commentId,
            userid
        );
        return res.status(200).json({
            success: true,
            message: 'Comment deleted successfully',
            data: result,
        });
    } catch (error: any) {
        const message = error.message;
        if (message === 'Comment not found') {
            return res.status(404).json({ success: false, error: message });
        }

        if (message === 'Unauthorized') {
            return res.status(403).json({ success: false, error: message });
        }

        return res.status(500).json({
            success: false,
            error: 'Failed to delete comment',
        });
    }
};
//Like/Dislike a comment by comment Id
const toggleLikeComment = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const commentId = parseInt(req.params.id);
        const result = await commentServices.toggleLikeComment(
            commentId,
            userId
        );
        return res.status(200).json({
            success: true,
            message: result.isLiked ? 'Comment liked' : 'Comment unliked',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Failed to toggle like on comment',
        });
    }
};

export default {
    commentOnPostById,
    deleteCommentById,
    getCommentsByPostId,
    toggleLikeComment,
};
