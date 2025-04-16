import { userController } from "../src/controllers/user.controller";

export async function POST(req: Request) {
    return await userController.loginUser(req)
}

export async function GET(req: Request) {
    return await userController.validateToken(req);
}