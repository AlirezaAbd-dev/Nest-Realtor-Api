import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserType } from "@prisma/client";
import * as jwt from "jsonwebtoken"
import { PrismaService } from "src/prisma/prisma.service";
import { AuthorizedUserType } from "src/user/interceptors/user.interceptor";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private readonly reflector: Reflector, private readonly prismaService: PrismaService) { }

    async canActivate(context: ExecutionContext) {

        const roles = this.reflector.getAllAndOverride<UserType[]>(process.env.ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ])

        if (roles?.length) {
            const req = context.switchToHttp().getRequest() as Request
            const token = (req.headers["authorization"] as string | undefined)?.split("Bearer ")[1]
            try {
                const payload = jwt.verify(token, process.env.JWT_SECRET) as AuthorizedUserType

                const user = await this.prismaService.user.findFirst({
                    where: {
                        id: payload.id
                    }
                })
                console.log(roles)
                console.log(user)
                if (!user) return false
                if (roles.includes(user.user_type)) return true

                return false
            } catch (err) {
                return false
            }
        }

        return true
    }
}