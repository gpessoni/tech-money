import { NextResponse } from "next/server"
import { investmentController } from "../src/controllers/investiment.controller"
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

        return await investmentController.deleteInvestment(params.id, userId, req);
    } catch (error) {
        return NextResponse.json(
            { error: "Erro ao deletar o investimento" },
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

        return await investmentController.getInvestmentById(params.id, userId, req);
    } catch (error) {
        return NextResponse.json(
            { error: "Erro ao buscar o investimento" },
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

        return await investmentController.updateInvestment(params.id, userId, req);
    } catch (error) {
        return NextResponse.json(
            { error: "Erro ao atualizar o investimento" },
            { status: HttpStatus.INTERNAL_SERVER_ERROR }
        );
    }
}
