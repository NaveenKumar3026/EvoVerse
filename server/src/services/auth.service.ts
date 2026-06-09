import { prisma } from "../config/prisma";
import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export const registerUser = async ({
  username,
  email,
  password,
}: RegisterData) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { username }
      ]
    }
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  return user;
};

export const loginUser = async (
  email: string,
  password: string
) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d",
    }
  );

  const { password: _, ...safeUser } = user;

  return {
    token,
    user: safeUser,
  };
};