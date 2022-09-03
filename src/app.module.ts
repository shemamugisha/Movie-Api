import {
  ClassSerializerInterceptor,
  Module,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { runtimeConfig } from './__shared__/config/app.config';
import { TypeOrmFactoryConfigService } from './__shared__/config/typeorm-factory-config.service';
import { DatabaseExceptionFilter } from './__shared__/filters/database-exception.filter';
import { HttpExceptionFilter } from './__shared__/filters/http-exception.filter';
import { RequestInterceptor } from './__shared__/interceptors/request.interceptor';
import { PasswordEncryption } from './__shared__/utils/PasswordEncryption';
import { MovieModule } from './movie/movie.module';
import { GlobalExceptionFilter } from './__shared__/filters/global-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [runtimeConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmFactoryConfigService,
    }),
    AuthModule,
    MovieModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    { provide: APP_FILTER, useClass: DatabaseExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: RequestInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    AppService,
    PasswordEncryption,
  ],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private configService: ConfigService) {}
  async onApplicationBootstrap(): Promise<void> {
    if (this.configService.get('env') !== 'production') {
    }
  }
}
