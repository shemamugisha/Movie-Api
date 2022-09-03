import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config';
import { User } from './entities/user.entity';
import { PasswordEncryption } from '../__shared__/utils/PasswordEncryption';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtRefreshStrategy } from './refresh-jwt.strategy';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    HttpModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwt').secret,
        signOptions: {
          expiresIn: configService.get('jwt').expiresIn,
          issuer: 'tss-api',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    PasswordEncryption,
    ConfigService,
  ],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
