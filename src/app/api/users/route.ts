import { NextResponse } from "next/server";
import { HttpStatus } from "../config/http/httpUtils";
import { userController } from "./src/controllers/user.controller";

export async function POST(req: Request) {
    try {
        return await userController.createUser(req);
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}

export async function GET() {
    try {
        return await userController.listUsers();
    } catch (error) {
        return NextResponse.json({
            message: "Erro no servidor",
            error: (error as Error).message
        }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}