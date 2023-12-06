import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ParamAndBody = createParamDecorator((paramAttribute: string, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const params = paramAttribute ? { [paramAttribute]: req.params?.[paramAttribute] } : req.params;

  return { ...params, ...req.body };
});
