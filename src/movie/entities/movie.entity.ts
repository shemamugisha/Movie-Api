import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/auth/entities/user.entity';
import BaseEntity from 'src/__shared__/models/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('movies')
export class Movie extends BaseEntity {
  @Column()
  @ApiProperty()
  externalId: number;
  @Column()
  @ApiProperty()
  title: string;
  @Column()
  @ApiProperty()
  summary: string;
  @Column()
  @ApiProperty()
  rank: number;
  @ManyToOne(() => User, (user) => user.movies)
  @ApiProperty()
  user: User;
}
