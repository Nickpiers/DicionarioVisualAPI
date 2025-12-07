import { Request, Response } from 'express';
import { createUser, getUsers, getUserById, updateUser, deleteUser } from '../services/user.service';
import { Role } from '@prisma/client';

/**
 * Handles the HTTP request to create a new user.
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
export const handleCreateUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!Object.values(Role).includes(role)) {
        return res.status(400).json({ message: 'Invalid role specified' });
    }

    const newUser = await createUser({ name, email, password, role });

    const { password: _, ...userWithoutPassword } = newUser;

    return res.status(201).json(userWithoutPassword);
  } catch (error: any) {
    if (error.code === 'P2002') {
        return res.status(409).json({ message: 'Email already exists' });
    }
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const handleGetUsers = async (req: Request, res: Response) => {  
    try {
        const users = await getUsers();
        return res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const handleGetUserById = async (req: Request, res: Response) => {  
  try {
    const user = await getUserById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const handleUpdateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (req.user?.id !== id) {
      return res.status(403).json({ message: 'Forbidden: You can only update your own account.' });
    }

    const { role, ...updateData } = req.body;
    if (role) {
      console.warn(`User ${req.user.id} attempted to change their own role. Denied.`);
    }

    if (updateData.password === '') {
        return res.status(400).json({ message: 'Password cannot be empty' });
    }

    const updatedUser = await updateUser(id, updateData);

    const { password: _, ...userWithoutPassword } = updatedUser;

    return res.status(200).json(userWithoutPassword);

  } catch (error: any) {
    if (error.code === 'P2002') {
        return res.status(409).json({ message: 'Email already exists' });
    }
    if (error.code === 'P2025') {
        return res.status(404).json({ message: 'User not found' });
    }
    console.error('Error updating user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


export const handleDeleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (req.user?.id !== id) {
      return res.status(403).json({ message: 'Forbidden: You can only delete your own account.' });
    }

    await deleteUser(id);

    return res.status(204).send();

  } catch (error: any) {
    if (error.code === 'P2025') {
        return res.status(404).json({ message: 'User not found' });
    }
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};