import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import JwtConfig from './jwt-config.interface';

interface AppConfig {
  port: number;
  env: any;
  url: string;
  defaultPassword: string;
  cron_expression: string;
  database?: TypeOrmModuleOptions;
  jwt: JwtConfig;
  allowedOrigins?: string[];
  tmdb: any;
}
export default AppConfig;
