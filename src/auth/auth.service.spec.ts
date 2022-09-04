/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

class ApiServiceMock {
  register(dto: RegisterDto) {
    return {};
  }
  login(dto: LoginDto) {
    return {};
  }
}

describe('authService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useClass: ApiServiceMock,
        },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('it should create user with encoded password', async () => {
      const spy = jest.spyOn(service, 'register');
      const dto = {
        ...new RegisterDto(),
        name: 'shema mugisha',
        email: 'sahemaaamugisha@gmail.com',
        password: bcrypt.hashSync('Pass@123', 10),
      };
      await service.register(dto);
      expect(spy).toHaveBeenCalledWith(dto);
    });
  });
  describe('login', () => {
    it('it should login user', async () => {
      const spy = jest.spyOn(service, 'login');
      const dto = {
        ...new LoginDto(),
        email: 'sahemaaamugisha@gmail.com',
        password: bcrypt.hashSync('Pass@123', 10),
      } as LoginDto;
      await service.login(dto);
      expect(spy).toHaveBeenCalledWith(dto);
    });
  });
});
