// userService.js
import { prisma } from "@/app/api/config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { createUserValidation, loginValidation, deleteUserValidation, updateUserValidation } from "../validation";

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";
const JWT_EXPIRES_IN = "6h";

export const userService = {
  async createUser(body: any) {
    const { error } = createUserValidation.validate(body, { abortEarly: false });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(", ");
      return { status: HttpStatus.BAD_REQUEST, error: errorMessage };
    }

    const { email, password, name } = body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await prisma.users.create({
        data: { email, name, password: hashedPassword },
        select: { id: true, email: true, name: true, createdAt: true, updatedAt: true },
      });

      return { status: HttpStatus.CREATED, data: user };
    } catch (err) {
      console.error(err);
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, error: "Erro ao criar usuário." };
    }
  },

  async loginUser(body: any) {
    const { error } = loginValidation.validate(body, { abortEarly: false });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(", ");
      return { status: HttpStatus.BAD_REQUEST, error: errorMessage };
    }

    const { email, password } = body;
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return { status: HttpStatus.UNAUTHORIZED, error: "Credenciais inválidas" };
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return { status: HttpStatus.OK, data: { token } };
  },

  async deleteUser(id: string) {
    const { error } = deleteUserValidation.validate(id, { abortEarly: false });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(", ");
      return { status: HttpStatus.BAD_REQUEST, error: errorMessage };
    }

    const user = await prisma.users.findUnique({ where: { id } });

    if (!user) {
      return { status: HttpStatus.NOT_FOUND, error: "Usuário não encontrado" };
    }

    await prisma.users.delete({ where: { id } });
    return { status: HttpStatus.NO_CONTENT };
  },

  async getUserById(id: string) {
    const user = await prisma.users.findUnique({ where: { id } });

    if (!user) {
      return { status: HttpStatus.NOT_FOUND, error: "Usuário não encontrado" };
    }

    return { status: HttpStatus.OK, data: user };
  },

  async listUsers() {
    const users = await prisma.users.findMany();
    return { status: HttpStatus.OK, data: users };
  },

  async updateUser(id: string, body: any) {
    const { error } = updateUserValidation.validate(body, { abortEarly: false });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(", ");
      return { status: HttpStatus.BAD_REQUEST, error: errorMessage };
    }

    const user = await prisma.users.findUnique({ where: { id } });

    if (!user) {
      return { status: HttpStatus.NOT_FOUND, error: "Usuário não encontrado" };
    }

    const { email, password } = body;
    const updatedData = { email, password };

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.users.update({
      where: { id },
      data: updatedData,
      select: { id: true, email: true, name: true, createdAt: true, updatedAt: true },
    });

    return { status: HttpStatus.OK, data: updatedUser };
  },

  async validateToken(authHeader: string) {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { status: HttpStatus.UNAUTHORIZED, error: "Token não fornecido ou formato inválido" };
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return { status: HttpStatus.OK, data: { valid: true, decoded } };
    } catch {
      return { status: HttpStatus.UNAUTHORIZED, error: "Token inválido" };
    }
  },
};
