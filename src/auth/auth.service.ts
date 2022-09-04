import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { PasswordEncryption } from '../__shared__/utils/PasswordEncryption';
import { LoginResponse } from './dto/login-resp.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly passwordEncryption: PasswordEncryption,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async register(registerDto: RegisterDto): Promise<User> {
    Logger.debug(registerDto);
    if (
      await this.userRepository.findOne({ where: { email: registerDto.email } })
    )
      throw new BadRequestException('User already exists');
    const passwordHash = await this.passwordEncryption.hashPassword(
      registerDto.password,
    );
    return await this.userRepository.save({
      ...new User(),
      ...registerDto,
      password: passwordHash,
    });
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new ForbiddenException('The email or password is incorrect');
    } else {
      const isMatch = await this.passwordEncryption.comparePassword(
        password,
        user.password,
      );
      if (!isMatch) {
        throw new ForbiddenException('The email or password is incorrect');
      }
      const accessToken = await this.jwtService.signAsync({
        id: user.id,
      });
      const refreshToken = await this.jwtService.signAsync({
        id: user.id,
      });
      user.refreshToken = refreshToken;
      await this.userRepository.save(user);

      return {
        accessToken,
        refreshToken,
      };
    }
  }

  async getProfile(user: User): Promise<Partial<User>> {
    return await this.userRepository.findOne({
      where: {
        id: user.id,
      },
    });
  }

  async refreshToken({
    id,
    refreshToken,
  }: User): Promise<{ accessToken: string; refreshToken: string }> {
    return {
      accessToken: await this.jwtService.signAsync({
        id,
      }),
      refreshToken,
    };
  }

  async logout({ id }: User): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOne({ where: { id } });
    user.refreshToken = null;
    await this.userRepository.save(user);
    return;
  }
}
