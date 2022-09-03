import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { User } from './entities/user.entity';
import {
  BadRequestResponse,
  ConflictResponse,
  CreatedResponse,
  ErrorResponses,
  OkResponse,
  Operation,
  UnauthorizedResponse,
} from '../__shared__/decorators';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import JwtRefreshGuard from './guards/jwt-refresh.guard';
import { GenericResponse } from 'src/__shared__/dto/generic-response.dto';

@ApiTags('Authentication')
@ApiExtraModels(User)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @Operation('Register user')
  @CreatedResponse()
  @ErrorResponses(ConflictResponse, BadRequestResponse)
  async registerCompany(
    @Body() registerDto: RegisterDto,
  ): Promise<GenericResponse<any>> {
    await this.authService.register(registerDto);
    return new GenericResponse('You successfully registered');
  }

  @Post('/login')
  @Operation('Login on the dashboard')
  @OkResponse()
  @ErrorResponses(UnauthorizedResponse, BadRequestResponse)
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<GenericResponse<{ refreshToken: string }>> {
    const { accessToken, refreshToken } = await this.authService.login(
      loginDto,
    );
    this.setCookies(
      response,
      ['nest_jwt', accessToken],
      ['nest_refresh_jwt', refreshToken],
    );

    return new GenericResponse('You have logged in successfully', {
      refreshToken,
    });
  }

  @Get('/profile')
  @Operation("Get the current user's profile")
  @OkResponse(User)
  @Auth()
  async getProfile(
    @GetUser() user: User,
  ): Promise<GenericResponse<Partial<User>>> {
    const results = await this.authService.getProfile(user);
    return new GenericResponse('Profile retrieved successfully', results);
  }

  @Get('/refresh-token')
  @Operation('Generate a new access token and update the cookie')
  @OkResponse()
  @ApiCookieAuth()
  @UseGuards(JwtRefreshGuard)
  async refreshToken(
    @Res({ passthrough: true }) response: Response,
    @GetUser() user: User,
  ): Promise<GenericResponse<{ refreshToken: string }>> {
    const { accessToken, refreshToken } = await this.authService.refreshToken(
      user,
    );
    this.setCookies(response, ['nest_jwt', accessToken]);
    return new GenericResponse('Token refreshed successfully', {
      refreshToken,
    });
  }

  @Get('/logout')
  @Operation('Log out and clear cookies')
  @OkResponse()
  @Auth()
  async logout(
    @Res({ passthrough: true }) response: Response,
    @GetUser() user: User,
  ): Promise<GenericResponse<void>> {
    await this.authService.logout(user);
    response.clearCookie('nest_jwt');
    response.clearCookie('nest_refresh_jwt');
    return new GenericResponse('Logged out successfully');
  }

  private setCookies(response: Response, ...cookies: [string, string][]) {
    cookies.forEach(([name, val]) => {
      response.cookie(name, val, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
    });
  }
}
