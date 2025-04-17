import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { expenseService } from "../services/expense.service";
import { NextResponse } from "next/server";
import { ListExpensesResponse } from "../interfaces/expense.interface";
import jwt from "jsonwebtoken";
import { ExpenseCategory } from "@prisma/client";

interface ExpenseBody {
  amount: number;
  description: string;
  category: ExpenseCategory;
  userId: string;
  date?: Date;
}

export const expenseController = {
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
          { error: "Você não tem permissão para acessar esta despesa" },
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

  async createExpense(body: ExpenseBody) {
    try {
      const result = await expenseService.createExpense(body);
      return NextResponse.json(result.data || { error: result.error }, { status: result.status });
    } catch (error) {
      console.log(error)
      return NextResponse.json(
        { error: "Erro ao criar a despesa." },
        { status: HttpStatus.INTERNAL_SERVER_ERROR }
      );
    }
  },
  
  async deleteExpense(id: string, userId: string, req: Request) {
    const tokenValidationResponse = this.validateUserToken(userId, req);
    if (tokenValidationResponse) {
      return tokenValidationResponse;
    }

    const result = await expenseService.deleteExpense(id);
    return NextResponse.json({ error: result.error }, { status: result.status });
  },

  async getExpenseById(id: string, userId: string, req: Request) {
    const tokenValidationResponse = this.validateUserToken(userId, req);
    if (tokenValidationResponse) {
      return tokenValidationResponse;
    }

    const result = await expenseService.getExpenseById(id);
    return NextResponse.json(result.data || { error: result.error }, { status: result.status });
  },

  async listExpenses(userId: string, req: Request) {
    const tokenValidationResponse = this.validateUserToken(userId, req);
    if (tokenValidationResponse) {
      return tokenValidationResponse;
    }

    const result: ListExpensesResponse = await expenseService.listExpenses(userId);
    return NextResponse.json(result.data || { error: result.error }, { status: result.status });
  },

  async updateExpense(id: string, userId: string, req: Request) {
    const tokenValidationResponse = this.validateUserToken(userId, req);
    if (tokenValidationResponse) {
      return tokenValidationResponse;
    }

    const body = await req.json() as ExpenseBody;
    const result = await expenseService.updateExpense(id, body);
    return NextResponse.json(result.data || { error: result.error }, { status: result.status });
  }
};
