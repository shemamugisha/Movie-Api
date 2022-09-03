import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import 'dotenv/config';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.nest_jwt,
      ]),
      secretOrKey: configService.get('jwt').secret,
      passReqToCallback: true,
      ignoreExpiration: true,
    });
  }

  async validate(req: Request): Promise<User> {
    const refreshToken = req?.cookies?.nest_refresh_jwt;
    const user: User = await this.userRepository.findOne({
      where: { refreshToken },
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}

// @Injectable()
// export class JwtRefreshStrategy extends PassportStrategy(
//   Strategy,
//   'jwt-refresh',
// ) {
//   constructor(
//     @InjectRepository(User)
//     private userRepository: Repository<User>,
//     private configService: ConfigService,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromExtractors([
//         (request: Request) => request?.cookies?.nest_refresh_jwt,
//       ]),
//       secretOrKey: configService.get('jwt').secret,
//       passReqToCallback: true,
//       ignoreExpiration: true,
//     });
//   }

//   async validate(req: Request, payload: JwtPayload): Promise<User> {
//     const { id } = payload;
//     const user: User = await this.userRepository.findOne({
//       where: { id, refreshToken: req.cookies['nest_refresh_jwt'] },
//     });
//     if (!user) throw new UnauthorizedException();
//     return user;
//   }
// }
