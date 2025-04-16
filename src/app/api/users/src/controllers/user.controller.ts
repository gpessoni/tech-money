import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { userService } from "../services/user.service";
import { NextResponse } from "next/server";
import { ListUsersResponse } from "../interfaces/user.interface";
import jwt from "jsonwebtoken";

export const userController = {
  validateUserToken(id: string, req: Request) {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Token não fornecido" },
        { status: HttpStatus.UNAUTHORIZED }
      );
    }

    const token = authHeader.split(" ")[1];
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
      const userId = decodedToken.sub;

      if (userId !== id) {
        return NextResponse.json(
          { error: "Você não tem permissão para deletar este usuário" },
          { status: HttpStatus.FORBIDDEN }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: "Token inválido ou expirado" },
        { status: HttpStatus.UNAUTHORIZED }
      );
    }
  },

  async createUser(req: Request) {
    try {
      const body = await req.json();

      const existingUser = await userService.getUserByEmail(body.email);
      if (existingUser.data) {
        return NextResponse.json(
          { error: "E-mail já cadastrado." },
          { status: HttpStatus.CONFLICT }
        );
      }

      const result = await userService.createUser(body);
      return NextResponse.json(result.data || { error: result.error }, { status: result.status });
    } catch (error) {
      return NextResponse.json(
        { error: "Erro ao criar o usuário." },
        { status: HttpStatus.INTERNAL_SERVER_ERROR }
      );
    }
  },

  async loginUser(req: Request) {
    const body = await req.json();
    const result = await userService.loginUser(body);
    return NextResponse.json(result.data || { error: result.error }, { status: result.status });
  },

  async deleteUser(id: string, req: Request) {
    const tokenValidationResponse = this.validateUserToken(id, req);
    if (tokenValidationResponse) {
      return tokenValidationResponse;
    }

    const result = await userService.deleteUser(id);
    return NextResponse.json({ error: result.error }, { status: result.status });
  },

  async getUserById(id: string) {
    const result = await userService.getUserById(id);
    return NextResponse.json(result.data || { error: result.error }, { status: result.status });
  },

  async listUsers() {
    const result: ListUsersResponse = await userService.listUsers();
    return NextResponse.json(result.data || { error: result.error }, { status: result.status });
  },

  async updateUser(id: string, req: Request) {
    const body = await req.json();

    const existingUser = await userService.getUserByEmail(body.email);
    if (existingUser.data) {
      return NextResponse.json(
        { error: "E-mail já cadastrado." },
        { status: HttpStatus.CONFLICT }
      );
    }

    const result = await userService.updateUser(id, body);

    return NextResponse.json(result.data || { error: result.error }, { status: result.status });
  },

  async validateToken(req: Request) {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Token não fornecido" },
        { status: HttpStatus.UNAUTHORIZED }
      );
    }

    try {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.JWT_SECRET as string);
      return NextResponse.json({ message: "Token válido" }, { status: HttpStatus.OK });
    } catch {
      return NextResponse.json(
        { error: "Token inválido ou expirado" },
        { status: HttpStatus.UNAUTHORIZED }
      );
    }
  },
};
