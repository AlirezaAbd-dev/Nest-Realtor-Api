import { UserType } from "@prisma/client";
import { SetMetadata } from "@nestjs/common"

export const Roles = (...roles: UserType[]) =>
    SetMetadata(process.env.ROLES_KEY, roles);
