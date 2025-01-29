import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { currentUserInterface, requestUser } from '../interface/interfaces';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: requestUser = ctx.switchToHttp().getRequest();
    const user: currentUserInterface = request.user;
    return data ? user?.[data] : user;
  },
);
