import prisma from '../prisma/prismaClient';
import { Prisma } from '@prisma/client';
import { CreateUserInput, LoginUserInput } from '../types/userServices';
import { generateToken } from '../utils/jwt';
import bcrypt from 'bcrypt';

// Get all users
const getAllUsers = async () => {
    return await prisma.user.findMany({ omit: { passwordHash: true } });
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
        omit: { passwordHash: true },
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
const getUserById = async (id: number, currentUserId?: number) => {
    const user = await prisma.user.findUnique({
        where: { id: id },
        omit: { passwordHash: true },
    });
    if (!user) return null;
    let isFollowing = false;
    if (currentUserId && currentUserId !== id) {
        const follow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: currentUserId,
                    followingId: id,
                },
            },
        });
        isFollowing = !!follow;
    }
    return {
        ...user,
        isFollowing,
    };
};

// Get a user by Username
const getUserByUsername = async (username: string) => {
    return await prisma.user.findUnique({
        where: { username: username },
        omit: { passwordHash: true },
    });
};

// Update a user
const updateUser = async (id: number, data: Prisma.UserCreateInput) => {
    return await prisma.user.update({
        where: { id: id },
        omit: { passwordHash: true },
        data,
    });
};

// Delete a user
const deleteUser = async (id: number) => {
    return await prisma.user.delete({ where: { id: id } });
};

// Follow/Unfollow user
const toggleFollowUser = async (followerId: number, followingId: number) => {
    if (followerId === followingId) {
        throw new Error("You can't follow yourself");
    }
    const existingFollow = await prisma.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId,
                followingId,
            },
        },
    });

    if (existingFollow) {
        // Unfollow
        await prisma.follow.delete({
            where: {
                id: existingFollow.id,
            },
        });
        await prisma.user.update({
            where: { id: followerId },
            data: { followingCount: { decrement: 1 } },
        });
        const updated = await prisma.user.update({
            where: { id: followingId },
            data: { followerCount: { decrement: 1 } },
        });
        return {
            isFollowing: false,
            followersCount: updated.followerCount,
        };
    } else {
        // Follow
        await prisma.follow.create({
            data: {
                followerId,
                followingId,
            },
        });
        await prisma.user.update({
            where: { id: followerId },
            data: { followingCount: { increment: 1 } },
        });
        const updated = await prisma.user.update({
            where: { id: followingId },
            data: { followerCount: { increment: 1 } },
        });
        return {
            isFollowing: true,
            followersCount: updated.followerCount,
        };
    }
};

// Get Followers/Following
const getUserFollowCount = async (id: number) => {
    return await prisma.user.findUnique({
        where: { id: id },
        select: { followerCount: true, followingCount: true },
    });
};

export default {
    getAllUsers,
    getUserByUsername,
    createUser,
    loginUser,
    getUserById,
    updateUser,
    deleteUser,
    toggleFollowUser,
    getUserFollowCount,
};
