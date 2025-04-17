import { NextResponse } from "next/server";
import { HttpStatus } from "../config/http/httpUtils";
import { expenseController } from "./src/controllers/expense.controller";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
            return NextResponse.json(
                { error: "Token não fornecido" },
                { status: HttpStatus.UNAUTHORIZED }
            );
        }

        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
        const userId = decodedToken.sub;

        const body = await req.json();
        body.userId = userId;

        return await expenseController.createExpense(body);
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { error: "Erro ao criar a despesa" },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        );
    }
}


export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
            return NextResponse.json(
                { error: "Token não fornecido" },
                { status: HttpStatus.UNAUTHORIZED }
            );
        }

        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
        const userId = decodedToken.sub;

        if (userId) return await expenseController.listExpenses(userId, req);
    } catch (error) {
        return NextResponse.json(
            { error: "Erro ao listar as despesas" },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        );
    }
}