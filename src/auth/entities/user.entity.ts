import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Movie } from 'src/movie/entities/movie.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import BaseEntity from '../../__shared__/models/base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true, nullable: false })
  @ApiProperty()
  email: string;

  @Exclude()
  @Column({ nullable: false })
  password?: string;

  @Exclude()
  @Column({ nullable: true })
  refreshToken: string;

  @Column()
  @ApiProperty()
  name: string;

  @OneToMany(() => Movie, (movie) => movie.user)
  public movies: Movie[];
}
