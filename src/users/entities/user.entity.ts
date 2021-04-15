import {
  BaseEntity,
  Entity,
  Unique,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@Unique(['email', 'cpf'])
export class User extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 200 })
  email: string;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  name: string;

  @Column({ nullable: false, type: 'varchar', length: 20 })
  role: string;

  @Column({ nullable: false, type: 'varchar', length: 11 })
  cpf: string;

  @Column({ nullable: false })
  salt: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false, type: 'timestamp with time zone' })
  birthday: Date;

  @Column({ nullable: true, type: 'varchar', length: 200 })
  avatar_url: string;

  @Column({ nullable: true, type: 'varchar', length: 64 })
  confirmationToken: string;

  @Column({ nullable: true, type: 'varchar', length: 64 })
  recoverToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
