import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Creates a new user in the database with a hashed password.
 * @param userData - The user data to create.
 * @returns The newly created user.
 */
export const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  
  const user = await prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
    },
  });

  console.log(`User created: ${user.email}`);

  return user;
};

export const getUsers = async (): Promise<User[]> => {
    return prisma.user.findMany();
};

export const getUserById = async (id: string): Promise<User[]> => {
    const result = await prisma.user.findMany({
      where: { id: { in: [id] } },
    });
    return result;
};

export const updateUser = async (id: string, data: Partial<User>): Promise<User> => {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  const user = await prisma.user.update({
    where: { id },
    data,
  });

  console.log(`User updated: ${user.email}`);
  return user;
};

export const deleteUser = async (id: string): Promise<User> => {
const user = await prisma.user.delete({
    where: { id },
  });

  console.log(`User deleted: ${user.email}`);
  return user;
};