// userService.ts
import { prisma } from "@/app/api/config/prisma";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { HttpStatus } from "@/app/api/config/http/httpUtils";
import {
  createUserValidation,
  loginValidation,
  deleteUserValidation,
  updateUserValidation,
} from "../validation";
import { User, UserWithoutPassowrd } from "../interfaces/user.interface";

const JWT_SECRET: string = process.env.JWT_SECRET || "defaultsecret";
const JWT_EXPIRES_IN: string = "6h";

interface ServiceResponse<T> {
  status: number;
  data?: T;
  error?: string;
}

const formatValidationError = (error: any): string =>
  error.details.map((detail: any) => detail.message).join(", ");

export const userService = {
  async createUser(body: Partial<User>): Promise<ServiceResponse<UserWithoutPassowrd>> {
    const { error } = createUserValidation.validate(body, { abortEarly: false });
    if (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: formatValidationError(error),
      };
    }

    const { email, password, name } = body;

    if (!email || !password || !name) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: "Email, password, and name are required.",
      };
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.users.create({
        data: { email, name, password: hashedPassword },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return { status: HttpStatus.CREATED, data: user };
    } catch (err) {
      console.error("Error creating user:", err);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "An error occurred while creating the user.",
      };
    }
  },

  async loginUser(body: { email: string; password: string }): Promise<ServiceResponse<{ token: string }>> {
    const { error } = loginValidation.validate(body, { abortEarly: false });
    if (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: formatValidationError(error),
      };
    }

    const { email, password } = body;

    try {
      const user = await prisma.users.findUnique({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return {
          status: HttpStatus.UNAUTHORIZED,
          error: "Invalid credentials",
        };
      }

      const token = jwt.sign(
        { email: user.email, name: user.name },
        JWT_SECRET,
        { subject: user.id, expiresIn: JWT_EXPIRES_IN }
      );

      return { status: HttpStatus.OK, data: { token } };
    } catch (err) {
      console.error("Error during login:", err);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "An error occurred while processing the login.",
      };
    }
  },

  async deleteUser(id: string): Promise<ServiceResponse<null>> {
    const { error } = deleteUserValidation.validate(id, { abortEarly: false });
    if (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: formatValidationError(error),
      };
    }

    try {
      const user = await prisma.users.findUnique({ where: { id } });
      if (!user) {
        return { status: HttpStatus.NOT_FOUND, error: "User not found" };
      }

      await prisma.users.delete({ where: { id } });
      return { status: HttpStatus.NO_CONTENT };
    } catch (err) {
      console.error("Error deleting user:", err);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "An error occurred while deleting the user.",
      };
    }
  },

  async getUserById(id: string): Promise<ServiceResponse<User>> {
    try {
      const user = await prisma.users.findUnique({ where: { id } });
      if (!user) {
        return { status: HttpStatus.NOT_FOUND, error: "User not found" };
      }

      return { status: HttpStatus.OK, data: user };
    } catch (err) {
      console.error("Error fetching user by ID:", err);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "An error occurred while fetching the user.",
      };
    }
  },

  async listUsers(): Promise<ServiceResponse<UserWithoutPassowrd[]>> {
    try {
      const users = await prisma.users.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return { status: HttpStatus.OK, data: users };
    } catch (err) {
      console.error("Error listing users:", err);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "An error occurred while listing users.",
      };
    }
  },
  
  async updateUser(id: string, body: Partial<User>): Promise<ServiceResponse<UserWithoutPassowrd>> {
    console.log("Aqui")
    const { error } = updateUserValidation.validate(body, { abortEarly: false });
    if (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: formatValidationError(error),
      };
    }

    try {
      const user = await prisma.users.findUnique({ where: { id } });
      if (!user) {
        return { status: HttpStatus.NOT_FOUND, error: "User not found" };
      }

      const updatedData = {
        ...body,
        password: body.password
          ? await bcrypt.hash(body.password, 10)
          : undefined,
      };

      const updatedUser = await prisma.users.update({
        where: { id },
        data: updatedData,
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return { status: HttpStatus.OK, data: updatedUser };
    } catch (err) {
      console.error("Error updating user:", err);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "An error occurred while updating the user.",
      };
    }
  },

  async getUserByEmail(email: string) {
    try {
      const user = await prisma.users.findUnique({ where: { email } });
      return { status: HttpStatus.OK, data: user };
    } catch (error) {
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: "Erro ao buscar usuário pelo e-mail." };
    }
  },



  async validateToken(authHeader: string): Promise<ServiceResponse<{ valid: boolean; decoded?: any }>> {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        error: "Invalid or missing token",
      };
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return { status: HttpStatus.OK, data: { valid: true, decoded } };
    } catch {
      return {
        status: HttpStatus.UNAUTHORIZED,
        error: "Invalid token",
      };
    }
  },
};
