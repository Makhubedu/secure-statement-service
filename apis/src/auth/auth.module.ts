import {
  Module,
  NestModule,
  MiddlewareConsumer,
  DynamicModule,
} from '@nestjs/common';
import { SuperTokensService } from './supertokens.service';
import { AuthMiddleware } from './auth.middleware';
import { AuthService } from './auth.service';
import { UserManagementService } from './user-management.service';
import { UserController } from './user.controller';

@Module({
  providers: [SuperTokensService, AuthService, UserManagementService],
  controllers: [UserController],
  exports: [SuperTokensService, AuthService, UserManagementService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }

  static forRoot(): DynamicModule {
    return {
      providers: [SuperTokensService, AuthService, UserManagementService],
      controllers: [UserController],
      exports: [SuperTokensService, AuthService, UserManagementService],
      global: true,
      module: AuthModule,
    };
  }
}