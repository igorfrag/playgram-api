import { Request, Response } from 'express';
import { serialize } from 'cookie';
import userService from '../services/userServices';
import postServices from '../services/postServices';

// Get all users
const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

// Create a new user
const createUser = async (req: Request, res: Response) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create user' });
    }
};

//Login user
const loginUser = async (req: Request, res: Response) => {
    const data = req.body;

    try {
        const { token, user } = await userService.loginUser(data);
        const cookie = serialize('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });
        res.setHeader('Set-Cookie', cookie);
        res.status(200).json({ user });
    } catch (error) {
        res.status(401).json({ error: 'Failed to login' });
    }
};

//Get Logged User
const getMe = async (req: Request, res: Response) => {
    const user = req.user;
    return res.status(200).json({
        success: true,
        data: user,
    });
};

// Get User by ID
const getUserById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const user = await userService.getUserById(id);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

// Get User by Username
const getUserByUsername = async (req: Request, res: Response) => {
    try {
        const username = req.params.username;
        const user = await userService.getUserByUsername(username);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

//Update User
const updateUser = async (req: Request, res: Response) => {
    const tokenId = req.userId;
    const paramId = parseInt(req.params.id);
    if (tokenId !== paramId) {
        return res.status(403).json({
            message: 'You are not allowed to edit this profile.',
        });
    }

    try {
        const updatedUser = await userService.updateUser(tokenId, req.body);
        res.status(200).json({
            message: 'Profile updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        res.status(400).json({
            error: 'Failed to update profile',
        });
    }
};

// Delete a user
const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        await userService.deleteUser(id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Failed to delete user' });
    }
};

const toggleFollowUser = async (req: Request, res: Response) => {
    const followerId = req.userId;
    const followingId = parseInt(req.params.id);

    try {
        const result = await userService.toggleFollowUser(
            followerId,
            followingId
        );
        res.status(200).json({
            success: true,
            message: result.isFollowing
                ? 'User followed successfully'
                : 'User unfollowed successfully',
            data: {
                is_following: result.isFollowing,
                followers_count: result.followersCount,
            },
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error following user',
        });
    }
};

const getUserFollowCount = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const followCount = await userService.getUserFollowCount(id);
        if (followCount) {
            res.status(200).json({
                success: true,
                data: followCount,
            });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch follow count' });
    }
};

const getUserPosts = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const targetUserId = parseInt(req.params.id);
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        const data = await postServices.getUserPosts({
            userId,
            targetUserId,
            page,
            limit,
        });

        if (!data) {
            return res.status(404).json({
                success: false,
                error: 'Usuário não encontrado',
            });
        }

        return res.status(200).json({
            success: true,
            data,
        });
    } catch (error: any) {
        const message = error.message;

        if (message === 'User not found') {
            return res.status(404).json({ success: false, error: message });
        }

        if (message === 'This profile is private') {
            return res.status(403).json({ success: false, error: message });
        }

        return res.status(500).json({
            success: false,
            error: 'Error fetching user posts',
        });
    }
};

export default {
    getAllUsers,
    getUserByUsername,
    createUser,
    loginUser,
    getMe,
    getUserById,
    updateUser,
    deleteUser,
    toggleFollowUser,
    getUserFollowCount,
    getUserPosts,
};
