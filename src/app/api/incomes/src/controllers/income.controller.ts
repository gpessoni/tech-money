import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { incomeService } from "../services/income.service";
import { NextResponse } from "next/server";
import { ListIncomesResponse } from "../interfaces/income.interface";
import jwt from "jsonwebtoken";

export const incomeController = {
  validateUserToken(userId: string, req: Request) {
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
      const tokenUserId = decodedToken.sub;

      if (tokenUserId !== userId) {
        return NextResponse.json(
          { error: "Você não tem permissão para acessar esta renda" },
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

  async createIncome(body: any) {
    try {
      const result = await incomeService.createIncome(body);
      return NextResponse.json(result.data || { error: result.error }, { status: result.status });
    } catch (error) {
      console.log(error)
      return NextResponse.json(
        { error: "Erro ao criar a renda." },
        { status: HttpStatus.INTERNAL_SERVER_ERROR }
      );
    }
  },
  
  async deleteIncome(id: string, userId: string, req: Request) {
    const tokenValidationResponse = this.validateUserToken(userId, req);
    if (tokenValidationResponse) {
      return tokenValidationResponse;
    }

    const result = await incomeService.deleteIncome(id);
    return NextResponse.json({ error: result.error }, { status: result.status });
  },

  async getIncomeById(id: string, userId: string, req: Request) {
    const tokenValidationResponse = this.validateUserToken(userId, req);
    if (tokenValidationResponse) {
      return tokenValidationResponse;
    }

    const result = await incomeService.getIncomeById(id);
    return NextResponse.json(result.data || { error: result.error }, { status: result.status });
  },

  async listIncomes(userId: string, req: Request) {
    const tokenValidationResponse = this.validateUserToken(userId, req);
    if (tokenValidationResponse) {
      return tokenValidationResponse;
    }

    const result: ListIncomesResponse = await incomeService.listIncomes(userId);
    return NextResponse.json(result.data || { error: result.error }, { status: result.status });
  },

  async updateIncome(id: string, userId: string, req: Request) {
    const tokenValidationResponse = this.validateUserToken(userId, req);
    if (tokenValidationResponse) {
      return tokenValidationResponse;
    }

    const body = await req.json();
    const result = await incomeService.updateIncome(id, body);
    return NextResponse.json(result.data || { error: result.error }, { status: result.status });
  }
};
