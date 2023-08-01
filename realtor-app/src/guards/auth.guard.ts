import { CanActivate, ExecutionContext } from "@nestjs/common";


export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        return true
    }
}