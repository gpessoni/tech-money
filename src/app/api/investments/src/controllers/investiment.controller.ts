import { HttpStatus } from "@/app/api/config/http/httpUtils";
import { investmentService } from "../services/investment.service";
import { NextResponse } from "next/server";
import { ListInvestmentsResponse } from "../interfaces/investiment.interface";
import jwt from "jsonwebtoken";

export const investmentController = {
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
          { error: "Você não tem permissão para acessar este investimento" },
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

  async createInvestment(body: any) {
    try {
      const result = await investmentService.createInvestment(body);
      return NextResponse.json(result.data || { error: result.error }, { status: result.status });
    } catch (error) {
      console.log(error)
      return NextResponse.json(
        { error: "Erro ao criar o investimento." },
        { status: HttpStatus.INTERNAL_SERVER_ERROR }
      );
    }
  },
  
  async deleteInvestment(id: string, userId: string, req: Request) {
    const tokenValidationResponse = this.validateUserToken(userId, req);
    if (tokenValidationResponse) {
      return tokenValidationResponse;
    }

    const result = await investmentService.deleteInvestment(id);
    return NextResponse.json({ error: result.error }, { status: result.status });
  },

  async getInvestmentById(id: string, userId: string, req: Request) {
    const tokenValidationResponse = this.validateUserToken(userId, req);
    if (tokenValidationResponse) {
      return tokenValidationResponse;
    }

    const result = await investmentService.getInvestmentById(id);
    return NextResponse.json(result.data || { error: result.error }, { status: result.status });
  },

  async listInvestments(userId: string, req: Request) {
    const tokenValidationResponse = this.validateUserToken(userId, req);
    if (tokenValidationResponse) {
      return tokenValidationResponse;
    }

    const result: ListInvestmentsResponse = await investmentService.listInvestments(userId);
    return NextResponse.json(result.data || { error: result.error }, { status: result.status });
  },

  async updateInvestment(id: string, userId: string, req: Request) {
    const tokenValidationResponse = this.validateUserToken(userId, req);
    if (tokenValidationResponse) {
      return tokenValidationResponse;
    }

    const body = await req.json();
    const result = await investmentService.updateInvestment(id, body);
    return NextResponse.json(result.data || { error: result.error }, { status: result.status });
  }
};
