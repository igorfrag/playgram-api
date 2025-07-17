import prisma from '../prisma/prismaClient';
import { Prisma } from '@prisma/client';
import { CreateUserInput, LoginUserInput } from '../types/userServices';
import { generateToken } from '../utils/jwt';
import bcrypt from 'bcrypt';

// Get all users
const getAllUsers = async () => {
    return await prisma.user.findMany();
};

// Create a new user
const createUser = async (data: CreateUserInput) => {
    const { password, ...rest } = data;
    const passwordHash = await bcrypt.hash(password, 10);
    return await prisma.user.create({
        data: {
            ...rest,
            passwordHash,
        },
    });
};

// Login user
const loginUser = async (data: LoginUserInput) => {
    const { email, password } = data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('User not Found');
    }
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
        throw new Error('Wrong password');
    }

    const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
    };
    const token = generateToken(payload);

    return { token, user: payload };
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
    loginUser,
    getUserById,
    updateUser,
    deleteUser,
};
