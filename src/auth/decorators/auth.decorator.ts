import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiCookieAuth } from '@nestjs/swagger';
import { JwtGuard } from '../guards/jwt.guard';

export function Auth() {
  return applyDecorators(ApiCookieAuth(), UseGuards(JwtGuard));
}
