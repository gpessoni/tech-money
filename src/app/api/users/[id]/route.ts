import { NextResponse } from "next/server"
import { userController } from "../src/controllers/user.controller"
import { HttpStatus } from "@/app/api/config/http/httpUtils"

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        return await userController.deleteUser(params.id)
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

export async function PATCH(req: Request, context: { params: { id: string } }) {
    try {
        const { id } = context.params
        const body = await req.json()

        if (!id) {
            return NextResponse.json({ error: "ID do usuário é obrigatório" }, { status: HttpStatus.BAD_REQUEST })
        }
        return await userController.updateUser(id, body)
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
