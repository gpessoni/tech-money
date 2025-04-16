import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { userService } from "../services/user.service";
import { NextResponse } from "next/server";
import { ListUsersResponse } from "../interfaces/user.interface";
import jwt from "jsonwebtoken";

export const userController = {
  async createUser(req: Request) {
    const body = await req.json();
    const result = await userService.createUser(body);
    return NextResponse.json(result.data || { error: result.error }, { status: result.status });
  },

  async loginUser(req: Request) {
    const body = await req.json();
    const result = await userService.loginUser(body);
    return NextResponse.json(result.data || { error: result.error }, { status: result.status });
  },

  async deleteUser(id: string, req: Request) {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: HttpStatus.UNAUTHORIZED });
    }
    const token = authHeader.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
    const userId = decodedToken.sub;

    if (userId !== id) {
      return NextResponse.json({ error: "Você não tem permissão para deletar este usuário" }, { status: HttpStatus.FORBIDDEN });
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
    const result = await userService.updateUser(id, body);
    return NextResponse.json(result.data || { error: result.error }, { status: result.status });
  },

  async validateToken(req: Request) {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: HttpStatus.UNAUTHORIZED });
    }
    const result = await userService.validateToken(authHeader);
    return NextResponse.json(result.data || { error: result.error }, { status: result.status });
  },
};
