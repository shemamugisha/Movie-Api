/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Repository, FindOneOptions, FindManyOptions } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';

class ApiServiceMock {
  create(dto: CreateMovieDto, user: User) {
    return {};
  }
  findAll(user: User) {
    return {};
  }
  findOne(id: string, user: User) {
    return {};
  }
  getPopularMovies(id: string) {
    return {};
  }
  update(id: string, dto: UpdateMovieDto, user: User) {
    return {};
  }

  remove(id: string, user: User) {
    return {};
  }
}
describe.only('MovieService', () => {
  let service: MovieService;

  beforeAll(async () => {
    const ApiServiceProvider = {
      provide: MovieService,
      useClass: ApiServiceMock,
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovieService, ApiServiceProvider],
    }).compile();
    service = module.get<MovieService>(MovieService);
  });

  it('should create movie', async () => {
    const createMovie = jest.spyOn(service, 'create');
    const dto = new CreateMovieDto();
    const user = new User();
    service.create(dto, user);
    expect(createMovie).toHaveBeenCalledWith(dto, user);
  });

  it('should get movie list', async () => {
    const findAllMovie = jest.spyOn(service, 'findAll');
    const user = new User();
    service.findAll(user);
    expect(findAllMovie).toHaveBeenCalledWith(user);
  });

  it('should get one  movie', async () => {
    const findOne = jest.spyOn(service, 'findOne');
    const user = new User();
    service.findOne(1, user);
    expect(findOne).toHaveBeenCalledWith(1, user);
  });

  it('should get popular movie', async () => {
    const findPopular = jest.spyOn(service, 'getPopularMovies');
    service.getPopularMovies(1);
    expect(findPopular).toHaveBeenCalledWith(1);
  });

  it('should update movie', async () => {
    const updateMovie = jest.spyOn(service, 'update');
    const dto = new UpdateMovieDto();
    const user = new User();
    service.update(1, dto, user);
    expect(updateMovie).toHaveBeenCalledWith(1, dto, user);
  });

  it('should remove movie', async () => {
    const removeMovie = jest.spyOn(service, 'remove');
    const user = new User();
    service.remove(1, user);
    expect(removeMovie).toHaveBeenCalledWith(1, user);
  });
});
