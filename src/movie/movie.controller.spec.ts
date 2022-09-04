/* eslint-disable @typescript-eslint/no-empty-function */
import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { User } from 'src/auth/entities/user.entity';
import { UpdateMovieDto } from './dto/update-movie.dto';

describe('AuthController test', () => {
  let service: MovieService;
  let controller: MovieController;

  beforeAll(async () => {
    const ApiServiceProvider = {
      provide: MovieService,
      useFactory: () => ({
        create: jest.fn(() => {}),
        findAll: jest.fn(() => {}),
        findOne: jest.fn(() => {}),
        getPopularMovies: jest.fn(() => {}),
        update: jest.fn(() => {}),
        remove: jest.fn(() => {}),

        // l: jest.fn(() => ({ accessToken: '', refreshToken: '' })),
      }),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [MovieService, ApiServiceProvider],
    }).compile();

    controller = app.get<MovieController>(MovieController);
    service = app.get<MovieService>(MovieService);
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create movie', () => {
    const dto = new CreateMovieDto();
    const user = new User();
    controller.create(dto, user);
    expect(service.create).toHaveBeenCalled();
    expect(service.create).toHaveBeenCalledWith(dto, user);
  });

  it('get my list', () => {
    const user = new User();
    controller.findMyList(user);
    expect(service.findAll).toHaveBeenCalled();
    expect(service.findAll).toHaveBeenCalledWith(user);
  });

  it('get one movie', () => {
    const user = new User();
    controller.findOne('1', user);
    expect(service.findOne).toHaveBeenCalled();
    expect(service.findOne).toHaveBeenCalledWith(1, user);
  });

  it('get popular movie', () => {
    controller.findPopular('1');
    expect(service.getPopularMovies).toHaveBeenCalled();
    expect(service.getPopularMovies).toHaveBeenCalledWith(1);
  });

  it('update movie', () => {
    const dto = new UpdateMovieDto();
    const user = new User();
    controller.update('1', dto, user);
    expect(service.update).toHaveBeenCalled();
    expect(service.update).toHaveBeenCalledWith(1, dto, user);
  });

  it('remove movie', () => {
    const user = new User();
    controller.remove('1', user);
    expect(service.remove).toHaveBeenCalled();
    expect(service.remove).toHaveBeenCalledWith(1, user);
  });
});
