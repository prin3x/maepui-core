import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Roles } from 'src/roles/entities/roles.entity';

export interface IAuthPayload {
  id: string;
  email: string;
  iat?: number;
  role: Roles[];
  avatar: string;
  hash: string;
}

export const AuthPayload = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
