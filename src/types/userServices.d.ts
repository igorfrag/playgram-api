import { Prisma } from '@prisma/client';

export type CreateUserInput = Omit<Prisma.UserCreateInput, 'passwordHash'> & {
    password: string;
};

export type LoginUserInput = Pick<
    Prisma.UserCreateInput,
    'email' | 'password'
> & {
    password: string;
};
