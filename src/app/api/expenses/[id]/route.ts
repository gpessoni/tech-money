import { NextResponse } from "next/server"
import { expenseController } from "../src/controllers/expense.controller"
import { HttpStatus } from "@/app/api/config/http/httpUtils"
import jwt from "jsonwebtoken"

const getUserIdFromToken = (req: Request): string | null => {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
        return null;
    }

    try {
        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
        return decodedToken.sub || null;
    } catch (error) {
        return null;
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const userId = getUserIdFromToken(req);
        if (!userId) {
            return NextResponse.json(
                { error: "Token inválido ou não fornecido" },
                { status: HttpStatus.UNAUTHORIZED }
            );
        }

        return await expenseController.deleteExpense(params.id, userId, req);
    } catch (error) {
        return NextResponse.json(
            { error: "Erro ao deletar a despesa" },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        );
    }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const userId = getUserIdFromToken(req);
        if (!userId) {
            return NextResponse.json(
                { error: "Token inválido ou não fornecido" },
                { status: HttpStatus.UNAUTHORIZED }
            );
        }

        return await expenseController.getExpenseById(params.id, userId, req);
    } catch (error) {
        return NextResponse.json(
            { error: "Erro ao buscar a despesa" },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        );
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const userId = getUserIdFromToken(req);
        if (!userId) {
            return NextResponse.json(
                { error: "Token inválido ou não fornecido" },
                { status: HttpStatus.UNAUTHORIZED }
            );
        }

        return await expenseController.updateExpense(params.id, userId, req);
    } catch (error) {
        return NextResponse.json(
            { error: "Erro ao atualizar a despesa" },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        );
    }
}
