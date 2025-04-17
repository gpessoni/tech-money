// investmentService.ts
import { prisma } from "@/app/api/config/prisma";
import { HttpStatus } from "@/app/api/config/http/httpUtils";
import {
  createInvestmentValidation,
  deleteInvestmentValidation,
  updateInvestmentValidation,
} from "../validation";
import { Investment, ListInvestmentsResponse } from "../interfaces/investiment.interface";

interface ServiceResponse<T> {
  status: number;
  data?: T;
  error?: string;
}

const formatValidationError = (error: any): string =>
  error.details.map((detail: any) => detail.message).join(", ");

export const investmentService = {
  async createInvestment(body: Partial<Investment>): Promise<ServiceResponse<Investment>> {
    console.log(body)
    const { error } = createInvestmentValidation.validate(body, { abortEarly: false });
    if (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: formatValidationError(error),
      };
    }

    const { name, amount, yield: investmentYield, category, userId } = body;

    if (!name || !amount || !investmentYield || !category || !userId) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: "Nome, valor, rendimento, categoria e usuário são obrigatórios.",
      };
    }

    try {
      const investment = await prisma.investment.create({
        data: {
          name,
          amount,
          yield: investmentYield,
          category,
          userId
        }
      });

      return { status: HttpStatus.CREATED, data: investment };
    } catch (err) {
      console.error("Erro ao criar investimento:", err);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Ocorreu um erro ao criar o investimento.",
      };
    }
  },

  async deleteInvestment(id: string): Promise<ServiceResponse<null>> {
    const { error } = deleteInvestmentValidation.validate(id, { abortEarly: false });
    if (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: formatValidationError(error),
      };
    }

    try {
      const investment = await prisma.investment.findUnique({ where: { id } });
      if (!investment) {
        return { status: HttpStatus.NOT_FOUND, error: "Investimento não encontrado" };
      }

      await prisma.investment.delete({ where: { id } });
      return { status: HttpStatus.OK, data: null };
    } catch (err) {
      console.error("Erro ao deletar investimento:", err);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Ocorreu um erro ao deletar o investimento.",
      };
    }
  },

  async getInvestmentById(id: string): Promise<ServiceResponse<Investment>> {
    try {
      const investment = await prisma.investment.findUnique({ where: { id } });
      if (!investment) {
        return { status: HttpStatus.NOT_FOUND, error: "Investimento não encontrado" };
      }

      return { status: HttpStatus.OK, data: investment };
    } catch (err) {
      console.error("Erro ao buscar investimento por ID:", err);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Ocorreu um erro ao buscar o investimento.",
      };
    }
  },

  async listInvestments(userId: string): Promise<ListInvestmentsResponse> {
    try {
      const investments = await prisma.investment.findMany({
        where: { userId }
      });
      return { status: HttpStatus.OK, data: investments };
    } catch (err) {
      console.error("Erro ao listar investimentos:", err);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Ocorreu um erro ao listar os investimentos.",
      };
    }
  },

  async updateInvestment(id: string, body: Partial<Investment>): Promise<ServiceResponse<Investment>> {
    const { error } = updateInvestmentValidation.validate(body, { abortEarly: false });
    if (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: formatValidationError(error),
      };
    }

    try {
      const investment = await prisma.investment.findUnique({ where: { id } });
      if (!investment) {
        return { status: HttpStatus.NOT_FOUND, error: "Investimento não encontrado" };
      }

      const updatedInvestment = await prisma.investment.update({
        where: { id },
        data: body
      });

      return { status: HttpStatus.OK, data: updatedInvestment };
    } catch (err) {
      console.error("Erro ao atualizar investimento:", err);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Ocorreu um erro ao atualizar o investimento.",
      };
    }
  }
};
