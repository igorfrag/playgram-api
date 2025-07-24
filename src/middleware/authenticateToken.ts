import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import userService from '../services/userServices';

const authenticateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader?.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null;
    const tokenFromCookie = req.cookies?.token;

    const token = tokenFromHeader || tokenFromCookie;

    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    try {
        const decoded = verifyToken(token) as { id: number };
        const user = await userService.getUserById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        req.userId = user.id;

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export default authenticateToken;
