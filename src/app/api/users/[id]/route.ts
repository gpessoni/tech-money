import { NextResponse } from "next/server"
import { userController } from "../src/controllers/user.controller"
import { HttpStatus } from "@/app/api/config/http/httpUtils"

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const validateAuth: any = await userController.validateToken(req);
        if (validateAuth.error) {
            return NextResponse.json({ error: validateAuth.error }, { status: HttpStatus.UNAUTHORIZED })
        }

        return await userController.deleteUser(params.id, req)
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}

export async function GET(req: Request, context: { params: { id: string } }) {
    try {
        const { id } = context.params

        if (!id) {
            return NextResponse.json({ error: "ID do usuário é obrigatório" }, { status: HttpStatus.BAD_REQUEST })
        }

        return await userController.getUserById(id)
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}

export async function PUT(req: Request, context: { params: { id: string } }) {
    try {
        const { id } = context.params;
        return await userController.updateUser(id, req);
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
}
