import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Error as STError } from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import UserRoles from 'supertokens-node/recipe/userroles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const resp = ctx.getResponse();

    try {
      const session = await Session.getSession(req, resp, {
        overrideGlobalClaimValidators: () => {
          return [];
        },
      });

      const userId = session.getUserId();
      const userRoles = await UserRoles.getRolesForUser('public', userId);

      if (userRoles.status !== 'OK') {
        return false;
      }

      return requiredRoles.some((role) => userRoles.roles.includes(role));
    } catch (error) {
      if (STError.isErrorFromSuperTokens(error)) {
        return false;
      } else {
        throw error;
      }
    }
  }
}