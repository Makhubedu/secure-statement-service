import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import Session from 'supertokens-node/recipe/session';

export const SessionInfo = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const response = ctx.switchToHttp().getResponse();

    try {
      const session = await Session.getSession(request, response, {
        overrideGlobalClaimValidators: () => {
          return [];
        },
      });

      return {
        userId: session.getUserId(),
        sessionHandle: session.getHandle(),
        accessTokenPayload: session.getAccessTokenPayload(),
      };
    } catch (error) {
      return null;
    }
  },
);