import { ApiProperty } from '@nestjs/swagger';

export class ViewMovieDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  title: string;
  @ApiProperty()
  summary: string;
  @ApiProperty()
  rating: number;
}
