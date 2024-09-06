import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { PrismaClient } from '@prisma/client';
import Joi from 'joi';

const prisma = new PrismaClient();



export const signUp = asyncHandler(async (req, res) => {
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, confirmPassword, password, name } = req.body;

  const userExists = await prisma.users.findUnique({ where: { email } });
  if (userExists) {
    return res.status(401).json({ message: 'User already exists' });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.users.create({
    data: {
      email,
      password: hashPassword,
      name
    }
  });

  res.status(201).json({ message: 'User created successfully', user: newUser });
});

export const login = asyncHandler(async (req, res) => {
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, password } = req.body;

  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: 'Incorrect password' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, 'secretKey');
  await prisma.tokens.create({
    data: {
      token,
      user: {
        connect: { id: user.id }
      },
      agent: req.headers['user-agent']
    }
  });

  res.status(201).json({ message: 'User logged in successfully', user, token });
});

export const logout = asyncHandler(async (req, res) => {
  const { token } = req.headers;

  await prisma.tokens.updateMany({
    where: { token },
    data: { is_valid: false }
  });

  res.json({ success: true, message: 'Logged out successfully' });
});

export const userWithOrders = async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const userWithOrders = await prisma.users.findUnique({
      where: { id: userId },
      include: {
        orders: true,
      },
    });

    if (!userWithOrders) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(userWithOrders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user orders', error: error.message });
  }
};
