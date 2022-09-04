import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, lastValueFrom, map } from 'rxjs';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { ViewMovieDto } from './dto/view-movie.dto';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    private readonly http: HttpService,
    private readonly configService: ConfigService,
  ) {}
  async create(createMovieDto: CreateMovieDto, user: User): Promise<Movie> {
    if (
      await this.movieRepository.findOne({
        where: { externalId: createMovieDto.externalId, user },
      })
    ) {
      throw new BadRequestException(
        'You have already added that movie to your list',
      );
    }
    const movie = await lastValueFrom(
      this.http
        .get(
          `${this.configService.get('tmdb').url}/movie/${
            createMovieDto.externalId
          }?api_key=${this.configService.get('tmdb').apiKey}`,
        )
        .pipe(
          catchError((e) => {
            throw new InternalServerErrorException('Could not retrieve movie');
          }),
          map((response) => {
            return response.data;
          }),
        ),
    );
    const alreadyRankedMovie = await this.movieRepository.findOne({
      where: { rank: createMovieDto.rank, user },
    });
    if (alreadyRankedMovie) {
      return await this.movieRepository.save({
        ...alreadyRankedMovie,
        rank: createMovieDto.rank,
      });
    }
    return await this.movieRepository.save({
      ...new Movie(),
      externalId: movie?.id,
      title: movie?.original_title,
      summary: movie?.overview,
      rank: createMovieDto.rank,
      user,
    });
  }

  async findAll(user: User) {
    return await this.movieRepository.find({
      where: { user },
      order: { rank: 'ASC' },
    });
  }

  async findOne(id: number, user: User) {
    const foundMovie = await this.movieRepository.findOne({
      where: {
        id,
        user,
      },
    });

    if (!foundMovie) throw new NotFoundException('Movie not found');
    return foundMovie;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto, user: User) {
    const movie = await this.findOne(id, user);
    return await this.movieRepository.save(movie);
  }

  async remove(id: number, user: User) {
    const movie = await this.findOne(id, user);
    await this.movieRepository.softDelete(movie);
  }

  async getPopularMovies(page: number) {
    const movies = await lastValueFrom(
      this.http
        .get(
          `${this.configService.get('tmdb').url}/movie/popular?api_key=${
            this.configService.get('tmdb').apiKey
          }&page=${page}`,
        )
        .pipe(
          map((response) => {
            return {
              ...response.data,
              results: response.data.results?.map(
                (el) =>
                  ({
                    ...new ViewMovieDto(),
                    id: el.id,
                    title: el?.original_title,
                    summary: el?.overview,
                    rating: el?.vote_average,
                  } as ViewMovieDto),
              ),
            };
          }),
        ),
    );
    return movies;
  }
}
