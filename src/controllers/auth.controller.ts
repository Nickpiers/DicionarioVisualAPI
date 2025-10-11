import { Request, Response } from 'express';
import { authenticateUser } from '../services/auth.service';

/**
 * Handles the HTTP login request.
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
export const handleLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const token = await authenticateUser(email, password);

    if (!token) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.status(200).json({ token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};