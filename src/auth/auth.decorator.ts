import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface IAuthPayload {
  id: string;
  email: string;
  iat?: number;
  role: string;
  avatar: string;
  hash: string;
}

export const AuthPayload = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
