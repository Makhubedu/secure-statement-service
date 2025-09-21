import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Error as STError } from 'supertokens-node';

import Session from 'supertokens-node/recipe/session';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();

    let err = undefined;
    const req = ctx.getRequest();
    const resp = ctx.getResponse();

    try {
      await Session.getSession(req, resp, {
        overrideGlobalClaimValidators: () => {
          return [];
        },
      });
      return true;
    } catch (error) {
      err = error;
    }

    if (STError.isErrorFromSuperTokens(err)) {
      return false;
    } else {
      throw err;
    }
  }
}