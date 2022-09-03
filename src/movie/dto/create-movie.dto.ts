import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class CreateMovieDto {
  @IsNumber()
  @ApiProperty()
  externalId: number;
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  rank: number;
}
