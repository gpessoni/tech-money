import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { userService } from "../services/user.service";
import { NextResponse } from "next/server";

export const userController = {
  async createUser(body: any) {
    const result = await userService.createUser(body);
    return NextResponse.json(result.data || { error: result.error }, { status: result.status });
  },

  async loginUser(body: any) {
    const result = await userService.loginUser(body);
    return NextResponse.json(result.data || { error: result.error }, { status: result.status });
  },

  async deleteUser(id: string) {
    const result = await userService.deleteUser(id);
    return NextResponse.json(result.data || { error: result.error }, { status: result.status });
  },

  async getUserById(id: string) {
    const result = await userService.getUserById(id);
    return NextResponse.json(result.data || { error: result.error }, { status: result.status });
  },

  async listUsers() {
    const result: any = await userService.listUsers();
    return NextResponse.json(result.data || { error: result.error }, { status: result.status });
  },

  async updateUser(id: string, body: any) {
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
