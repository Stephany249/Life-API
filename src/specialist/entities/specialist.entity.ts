import {
  BaseEntity,
  Entity,
  Unique,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';

@Entity()
@Unique(['crm'])
export class Specialist extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  crm: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'id' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
