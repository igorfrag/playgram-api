import { Request, Response } from 'express';
const userService = require('../services/userServices');

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

//Update User
const updateUser = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const updatedUser = await userService.updateUser(id, req.body);
        res.json(updateUser);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update user' });
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

module.exports = {
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
};
