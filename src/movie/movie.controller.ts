import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { GenericResponse } from 'src/__shared__/dto/generic-response.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';

@Controller('movies')
@ApiTags('Movies Crud')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  @Auth()
  async create(
    @Body() createMovieDto: CreateMovieDto,
    @GetUser() user: User,
  ): Promise<GenericResponse<Movie>> {
    const result = await this.movieService.create(createMovieDto, user);
    return new GenericResponse('Movie created', result);
  }

  @Get('my-list')
  @Auth()
  async findMyList(@GetUser() user: User) {
    const result = await this.movieService.findAll(user);
    return new GenericResponse('Movies retrieved', result);
  }

  @Get('popular')
  @ApiQuery({ name: 'page', required: false })
  async findPopular(@Query('page') page: string) {
    const result = await this.movieService.getPopularMovies(+page || 1);
    return new GenericResponse('Movies retrieved', result);
  }

  @Get('my-list/:id')
  @Auth()
  async findOne(@Param('id', ParseIntPipe) id: string, @GetUser() user: User) {
    const result = await this.movieService.findOne(+id, user);
    return new GenericResponse('Movie retrieved', result);
  }

  @Patch(':id')
  @Auth()
  async update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
    @GetUser() user: User,
  ) {
    const result = await this.movieService.update(+id, updateMovieDto, user);
    return new GenericResponse('Movie Updated', result);
  }

  @Delete(':id')
  @Auth()
  async remove(@Param('id') id: string, @GetUser() user: User) {
    await this.movieService.remove(+id, user);
    return new GenericResponse('Movie Deleted');
  }
}
