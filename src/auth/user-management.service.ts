import { Injectable } from '@nestjs/common';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import UserRoles from 'supertokens-node/recipe/userroles';
import { getUser } from 'supertokens-node';

export interface CreateUserDto {
  email: string;
  password: string;
  role?: 'admin' | 'consumer';
}

@Injectable()
export class UserManagementService {
  /**
   * Create a new user programmatically
   */
  async createUser(userData: CreateUserDto) {
    try {
      // Create user with SuperTokens
      const response = await EmailPassword.signUp('public', userData.email, userData.password);
      
      if (response.status === 'OK') {
        // Assign role to user (default: consumer)
        const role = userData.role || 'consumer';
        await UserRoles.addRoleToUser('public', response.user.id, role);
        
        return {
          success: true,
          userId: response.user.id,
          email: response.user.emails[0],
          role: role,
        };
      } else {
        return {
          success: false,
          error: response.status, // 'EMAIL_ALREADY_EXISTS_ERROR'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string) {
    try {
      const userInfo = await getUser(userId);
      if (userInfo) {
        const roles = await UserRoles.getRolesForUser('public', userId);
        return {
          id: userInfo.id,
          email: userInfo.emails[0],
          roles: roles.roles,
        };
      }
      return null;
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  /**
   * Assign role to existing user
   */
  async assignRole(userId: string, role: 'admin' | 'consumer') {
    try {
      const response = await UserRoles.addRoleToUser('public', userId, role);
      return response.status === 'OK';
    } catch (error) {
      throw new Error(`Failed to assign role: ${error.message}`);
    }
  }
}