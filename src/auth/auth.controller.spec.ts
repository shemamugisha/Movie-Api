/* eslint-disable @typescript-eslint/no-empty-function */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthController } from './auth.controller';
import { LoginDto } from './dto/login.dto';
import { response } from 'express';

describe('AuthController test', () => {
  let service: AuthService;
  let controller: AuthController;

  beforeAll(async () => {
    const ApiServiceProvider = {
      provide: AuthService,
      useFactory: () => ({
        register: jest.fn(() => {}),
        login: jest.fn(() => ({ accessToken: '', refreshToken: '' })),
      }),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, ApiServiceProvider],
    }).compile();

    controller = app.get<AuthController>(AuthController);
    service = app.get<AuthService>(AuthService);
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Register user', () => {
    const dto = new RegisterDto();
    controller.register(dto);
    expect(service.register).toHaveBeenCalled();
    expect(service.register).toHaveBeenCalledWith(dto);
  });

  it('Login user', () => {
    const dto = new LoginDto();
    jest
      .spyOn(AuthController.prototype, 'setCookies')
      .mockImplementation(() => {
        return;
      });
    controller.login(dto, response);
    expect(service.login).toHaveBeenCalled();
    expect(service.login).toHaveBeenCalledWith(dto);
  });
});
