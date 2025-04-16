import { prisma } from "@/app/api/config/prisma"
import { HttpStatus } from "@/app/api/config/http/httpUtils"
import { createUserValidation } from "../validation"
import { NextResponse } from "next/server"
import bcrypt from "bcrypt"

export async function createUserService(req: Request) {
    try {
        const body = await req.json()
        const { error } = createUserValidation.validate(body, { abortEarly: false })

        if (error) {
            const errorMessage = error.details.map((detail: { message: any }) => detail.message).join(", ")
            return NextResponse.json({ error: errorMessage }, { status: HttpStatus.BAD_REQUEST })
        }

        const { email, password, name } = body

 

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.users.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
            },
        })

        return NextResponse.json(user, { status: HttpStatus.CREATED })
    } catch (error) {
        return NextResponse.json({ message: "Erro no servidor", error: (error as Error).message }, { status: HttpStatus.INTERNAL_SERVER_ERROR })
    }
}
