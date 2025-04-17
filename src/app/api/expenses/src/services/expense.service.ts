// expenseService.ts
import { prisma } from "@/app/api/config/prisma";
import { HttpStatus } from "@/app/api/config/http/httpUtils";
import {
  createExpenseValidation,
  deleteExpenseValidation,
  updateExpenseValidation,
} from "../validation";
import { Expense, ListExpensesResponse } from "../interfaces/expense.interface";
import { ExpenseCategory } from "@prisma/client";

interface ServiceResponse<T> {
  status: number;
  data?: T;
  error?: string;
}

const formatValidationError = (error: any): string =>
  error.details.map((detail: any) => detail.message).join(", ");

export const expenseService = {
  async createExpense(body: Partial<Expense>): Promise<ServiceResponse<Expense>> {
    console.log(body)
    const { error } = createExpenseValidation.validate(body, { abortEarly: false });
    if (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: formatValidationError(error),
      };
    }

    const { amount, description, date, userId, category } = body;

    if (!amount || !description || !userId || !category) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: "Valor, descrição, categoria e usuário são obrigatórios.",
      };
    }

    try {
      const expense = await prisma.expense.create({
        data: {
          amount,
          description,
          date: date || new Date(),
          userId,
          category
        }
      });

      return { status: HttpStatus.CREATED, data: expense };
    } catch (err) {
      console.error("Erro ao criar despesa:", err);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Ocorreu um erro ao criar a despesa.",
      };
    }
  },

  async deleteExpense(id: string): Promise<ServiceResponse<null>> {
    const { error } = deleteExpenseValidation.validate(id, { abortEarly: false });
    if (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: formatValidationError(error),
      };
    }

    try {
      const expense = await prisma.expense.findUnique({ where: { id } });
      if (!expense) {
        return { status: HttpStatus.NOT_FOUND, error: "Despesa não encontrada" };
      }

      await prisma.expense.delete({ where: { id } });
      return { status: HttpStatus.OK, data: null };
    } catch (err) {
      console.error("Erro ao deletar despesa:", err);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Ocorreu um erro ao deletar a despesa.",
      };
    }
  },

  async getExpenseById(id: string): Promise<ServiceResponse<Expense>> {
    try {
      const expense = await prisma.expense.findUnique({ where: { id } });
      if (!expense) {
        return { status: HttpStatus.NOT_FOUND, error: "Despesa não encontrada" };
      }

      return { status: HttpStatus.OK, data: expense };
    } catch (err) {
      console.error("Erro ao buscar despesa por ID:", err);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Ocorreu um erro ao buscar a despesa.",
      };
    }
  },

  async listExpenses(userId: string): Promise<ListExpensesResponse> {
    try {
      const expenses = await prisma.expense.findMany({
        where: { userId }
      });
      return { status: HttpStatus.OK, data: expenses };
    } catch (err) {
      console.error("Erro ao listar despesas:", err);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Ocorreu um erro ao listar as despesas.",
      };
    }
  },

  async updateExpense(id: string, body: Partial<Expense>): Promise<ServiceResponse<Expense>> {
    const { error } = updateExpenseValidation.validate(body, { abortEarly: false });
    if (error) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: formatValidationError(error),
      };
    }

    try {
      const expense = await prisma.expense.findUnique({ where: { id } });
      if (!expense) {
        return { status: HttpStatus.NOT_FOUND, error: "Despesa não encontrada" };
      }

      const updatedExpense = await prisma.expense.update({
        where: { id },
        data: body
      });

      return { status: HttpStatus.OK, data: updatedExpense };
    } catch (err) {
      console.error("Erro ao atualizar despesa:", err);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Ocorreu um erro ao atualizar a despesa.",
      };
    }
  }
};
