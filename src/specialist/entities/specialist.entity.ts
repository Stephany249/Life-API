import {
  BaseEntity,
  Entity,
  Unique,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  Column,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';

@Entity()
@Unique(['crm'])
export class Specialist extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  crm: string;

  @Column({ nullable: false })
  userId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
