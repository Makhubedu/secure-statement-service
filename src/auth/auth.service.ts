import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Session from 'supertokens-node/recipe/session';
import UserRoles from 'supertokens-node/recipe/userroles';
import { convertToRecipeUserId, getUser } from 'supertokens-node';
import type { Request, Response } from 'express';

export interface AuthResult {
  success: boolean;
  userId: string;
  email: string;
  roles: string[];
  message?: string;
  error?: string;
}

@Injectable()
export class AuthService {
  /**
   * Register a new user with email and password
   */
  async registerUser(
    email: string,
    password: string,
    role: 'admin' | 'consumer' = 'consumer',
    req: Request,
    res: Response,
  ): Promise<AuthResult> {
    try {
      // Create user with SuperTokens
      const signUpResponse = await EmailPassword.signUp('public', email, password);
      
      if (signUpResponse.status !== 'OK') {
        return {
          success: false,
          userId: '',
          email: '',
          roles: [],
          error: signUpResponse.status === 'EMAIL_ALREADY_EXISTS_ERROR' 
            ? 'Email already exists' 
            : 'Registration failed'
        };
      }

      // Assign role to user
      await UserRoles.addRoleToUser('public', signUpResponse.user.id, role);

      // Create session for the new user
      await Session.createNewSession(req, res, 'public', convertToRecipeUserId(signUpResponse.user.id));

      // Get user roles for response
      const userRoles = await UserRoles.getRolesForUser('public', signUpResponse.user.id);

      return {
        success: true,
        userId: signUpResponse.user.id,
        email: signUpResponse.user.emails[0],
        roles: userRoles.roles,
        message: 'Registration successful. Session created.',
      };
    } catch (error) {
      return {
        success: false,
        userId: '',
        email: '',
        roles: [],
        error: `Registration failed: ${error.message}`,
      };
    }
  }

  /**
   * Login user with email and password
   */
  async loginUser(
    email: string,
    password: string,
    req: Request,
    res: Response,
  ): Promise<AuthResult> {
    try {
      // Authenticate user with SuperTokens
      const signInResponse = await EmailPassword.signIn('public', email, password);
      
      if (signInResponse.status !== 'OK') {
        return {
          success: false,
          userId: '',
          email: '',
          roles: [],
          error: signInResponse.status === 'WRONG_CREDENTIALS_ERROR'
            ? 'Invalid email or password'
            : 'Login failed'
        };
      }

      // Create session
      await Session.createNewSession(req, res, 'public', convertToRecipeUserId(signInResponse.user.id));

      // Get user roles for response
      const userRoles = await UserRoles.getRolesForUser('public', signInResponse.user.id);

      return {
        success: true,
        userId: signInResponse.user.id,
        email: signInResponse.user.emails[0],
        roles: userRoles.roles,
        message: 'Login successful. Session created.',
      };
    } catch (error) {
      return {
        success: false,
        userId: '',
        email: '',
        roles: [],
        error: `Login failed: ${error.message}`,
      };
    }
  }

  /**
   * Logout user by revoking session
   */
  async logoutUser(req: Request, res: Response): Promise<{ success: boolean; message: string }> {
    try {
      // Get session if exists
      const session = await Session.getSession(req, res, { sessionRequired: false });
      
      if (session) {
        // Revoke the session
        await session.revokeSession();
      }

      return {
        success: true,
        message: 'Successfully logged out',
      };
    } catch (error) {
      // Even if there's an error, we should clear any remaining session data
      return {
        success: true,
        message: 'Logged out (session may have already expired)',
      };
    }
  }

  /**
   * Get current user information from session
   */
  async getCurrentUser(req: Request, res: Response): Promise<AuthResult> {
    try {
      // Get session
      const session = await Session.getSession(req, res);
      const userId = session.getUserId();

      // Get user roles
      const userRoles = await UserRoles.getRolesForUser('public', userId);

      // Get user email from SuperTokens
      const userInfo = await getUser(userId);
      if (!userInfo) {
        return {
          success: false,
          userId: '',
          email: '',
          roles: [],
          error: 'User not found',
        };
      }

      return {
        success: true,
        userId: userId,
        email: userInfo.emails[0],
        roles: userRoles.roles,
        message: 'User information retrieved',
      };
    } catch (error) {
      return {
        success: false,
        userId: '',
        email: '',
        roles: [],
        error: 'Authentication required',
      };
    }
  }

  /**
   * Verify if user has required role
   */
  async verifyUserRole(userId: string, requiredRole: string): Promise<boolean> {
    try {
      const userRoles = await UserRoles.getRolesForUser('public', userId);
      return userRoles.roles.includes(requiredRole);
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if user is authenticated (has valid session)
   */
  async isAuthenticated(req: Request, res: Response): Promise<boolean> {
    try {
      const session = await Session.getSession(req, res, { sessionRequired: false });
      return session !== undefined;
    } catch (error) {
      return false;
    }
  }
}