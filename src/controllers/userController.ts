import { Request, Response } from 'express';
import userService from '../services/userServices';

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
        res.status(200).json({ token, user });
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
export default {
    getAllUsers,
    getUserByUsername,
    createUser,
    loginUser,
    getMe,
    getUserById,
    updateUser,
    deleteUser,
};
