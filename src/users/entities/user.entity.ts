import { Expose } from 'class-transformer';
import {
  BaseEntity,
  Entity,
  Unique,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@Unique(['email', 'cpf'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  email: string;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  name: string;

  @Column({ nullable: false, type: 'varchar', length: 20 })
  role: string;

  @Column({ nullable: true, type: 'varchar', length: 11 })
  cpf: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true, type: 'timestamp with time zone' })
  birthday: Date;

  @Column({ nullable: true, type: 'varchar', length: 200 })
  avatar: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Expose({ name: 'avatar_url' })
  getAvatar(): string | null {
    return this.avatar
      ? `${process.env.APP_API_URL}/files/${this.avatar}`
      : null;
  }
}
