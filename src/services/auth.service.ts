import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

/**
 * Authenticates a user and returns a JWT.
 * @param email - The user's email.
 * @param password - The user's plain text password.
 * @returns A JWT string if authentication is successful, otherwise null.
 */
export const authenticateUser = async (email: string, password: string): Promise<string | null> => {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return null;
    }

    const jwtSecret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

    if (!jwtSecret) {
        console.error("JWT_SECRET is not defined in environment variables.");
        throw new Error("Server configuration error.");
    }

    const token = jwt.sign(
        { id: String(user.id), role: user.role },
        jwtSecret,
        { expiresIn: expiresIn } as jwt.SignOptions
    );

    console.log(`User authenticated successfully: ${email}`);
    return token;
};