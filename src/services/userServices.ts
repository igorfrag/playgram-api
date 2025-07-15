import prisma from '../prisma/prismaClient';
import { Prisma } from '@prisma/client';
// Get all users
const getAllUsers = async () => {
    return await prisma.user.findMany();
};

// Create a new user
const createUser = async (data: Prisma.UserCreateInput) => {
    return await prisma.user.create({ data });
};

// Get a user by ID
const getUserById = async (id: number) => {
    return await prisma.user.findUnique({ where: { id: id } });
};

// Update a user
const updateUser = async (id: number, data: Prisma.UserCreateInput) => {
    return await prisma.user.update({ where: { id: id }, data });
};

// Delete a user
const deleteUser = async (id: number) => {
    return await prisma.user.delete({ where: { id: id } });
};

module.exports = {
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
};
