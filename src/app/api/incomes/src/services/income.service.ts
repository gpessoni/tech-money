// incomeService.ts
import { prisma } from "@/app/api/config/prisma";
import { HttpStatus } from "@/app/api/config/http/httpUtils";
import {
  createIncomeValidation,
  deleteIncomeValidation,
  updateIncomeValidation,
} from "../validation";
import { Income, ListIncomesResponse } from "../interfaces/income.interface";

interface ServiceResponse<T> {
  status: number;
  data?: T;
  error?: string;
}

const formatValidationError = (error: any): string =>
  error.details.map((detail: any) => detail.message).join(", ");

export const incomeService = {
  async createIncome(body: Partial<Income>): Promise<ServiceResponse<Income>> {
    console.log(body)
    const { error } = createIncomeValidation.validate(body, { abortEarly: false });
    if (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: formatValidationError(error),
      };
    }

    const { amount, description, date, userId } = body;

    if (!amount || !description || !userId) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: "Valor, descrição e usuário são obrigatórios.",
      };
    }

    try {
      const income = await prisma.incomes.create({
        data: {
          amount,
          description,
          date: date || new Date(),
          userId
        }
      });

      return { status: HttpStatus.CREATED, data: income };
    } catch (err) {
      console.error("Erro ao criar renda:", err);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Ocorreu um erro ao criar a renda.",
      };
    }
  },

  async deleteIncome(id: string): Promise<ServiceResponse<null>> {
    const { error } = deleteIncomeValidation.validate(id, { abortEarly: false });
    if (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: formatValidationError(error),
      };
    }

    try {
      const income = await prisma.incomes.findUnique({ where: { id } });
      if (!income) {
        return { status: HttpStatus.NOT_FOUND, error: "Renda não encontrada" };
      }

      await prisma.incomes.delete({ where: { id } });
      return { status: HttpStatus.OK, data: null };
    } catch (err) {
      console.error("Erro ao deletar renda:", err);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Ocorreu um erro ao deletar a renda.",
      };
    }
  },

  async getIncomeById(id: string): Promise<ServiceResponse<Income>> {
    try {
      const income = await prisma.incomes.findUnique({ where: { id } });
      if (!income) {
        return { status: HttpStatus.NOT_FOUND, error: "Renda não encontrada" };
      }

      return { status: HttpStatus.OK, data: income };
    } catch (err) {
      console.error("Erro ao buscar renda por ID:", err);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Ocorreu um erro ao buscar a renda.",
      };
    }
  },

  async listIncomes(userId: string): Promise<ListIncomesResponse> {
    try {
      const incomes = await prisma.incomes.findMany({
        where: { userId }
      });
      return { status: HttpStatus.OK, data: incomes };
    } catch (err) {
      console.error("Erro ao listar rendas:", err);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Ocorreu um erro ao listar as rendas.",
      };
    }
  },

  async updateIncome(id: string, body: Partial<Income>): Promise<ServiceResponse<Income>> {
    const { error } = updateIncomeValidation.validate(body, { abortEarly: false });
    if (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: formatValidationError(error),
      };
    }

    try {
      const income = await prisma.incomes.findUnique({ where: { id } });
      if (!income) {
        return { status: HttpStatus.NOT_FOUND, error: "Renda não encontrada" };
      }

      const updatedIncome = await prisma.incomes.update({
        where: { id },
        data: body
      });

      return { status: HttpStatus.OK, data: updatedIncome };
    } catch (err) {
      console.error("Erro ao atualizar renda:", err);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Ocorreu um erro ao atualizar a renda.",
      };
    }
  }
};
