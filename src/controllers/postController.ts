import { Request, Response } from 'express';
import postService from '../services/postServices';
const UPLOAD_BASE_PATH = process.env.UPLOAD_BASE_PATH || '/uploads';

// New Post
const createNewPost = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const caption = req.body.caption;

        if (!req.file) {
            return res
                .status(400)
                .json({ success: false, message: 'Image is required' });
        }

        const imageUrl = `${UPLOAD_BASE_PATH}/${req.file.filename}`;
        const post = await postService.createNewPost({
            userId,
            imageUrl,
            caption,
        });

        return res.status(201).json({
            success: true,
            message: 'Post created successfully',
            data: {
                post,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error creating post',
        });
    }
};

// Get post by id
const getPostById = async (req: Request, res: Response) => {
    try {
        const postId = parseInt(req.params.id);
        const userId = req.user?.id;
        const post = await postService.getPostById(postId, userId);

        return res.status(200).json({
            success: true,
            data: { post },
        });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: 'Error fetching post' });
    }
};

// Get paginated feed
const getUserFeed = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        const data = await postService.getUserFeed({ userId, page, limit });

        return res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Error fetching posts',
        });
    }
};

const deletePostById = async (req: Request, res: Response) => {
    try {
        const postId = parseInt(req.params.id);
        const userId = req.userId;

        await postService.deletePostById(postId, userId);
        return res.status(200).json({
            success: true,
            message: 'Postagem deletada com sucesso',
        });
    } catch (error: any) {
        const message = error.message;

        if (message === 'Post not found') {
            return res.status(404).json({ success: false, error: message });
        }

        if (message === 'You have no permission to delete this post') {
            return res.status(403).json({ success: false, error: message });
        }

        return res.status(500).json({
            success: false,
            error: 'Error deleting post',
        });
    }
};

export default {
    createNewPost,
    getUserFeed,
    getPostById,
    deletePostById,
};
