import { NextResponse } from "next/server";
import { HttpStatus } from "../config/http/httpUtils";
import { incomeController } from "./src/controllers/income.controller";
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

        return await incomeController.createIncome(body);
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { error: "Erro ao criar a renda" },
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

        if (userId) return await incomeController.listIncomes(userId, req);
    } catch (error) {
        return NextResponse.json(
            { error: "Erro ao listar as rendas" },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        );
    }
}