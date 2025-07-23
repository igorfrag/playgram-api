import { Prisma } from '@prisma/client';

export type CreatePostInput = {
    userId: number;
    imageUrl: string;
    caption: string;
};

export type GetPostFeed = {
    userId: number;
    page: number;
    limit: number;
};

export type GetUserPosts = {
    userId: number;
    targetUserId: number;
    page: number;
    limit: number;
};

export type PostWithUserAndRelation = Prisma.PostGetPayload<{
    include: {
        user: true;
        comments: true;
        likes: true;
    };
    omit: {
        passwordHash: true;
        email: true;
    };
}>;
