import { Expose } from 'class-transformer';
import { Specialist } from '../../specialist/entities/specialist.entity';
import {
  BaseEntity,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Column,
} from 'typeorm';

@Entity()
export class Working extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  day: string;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  from: string;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  to: string;

  @Column({ nullable: false, type: 'varchar', length: 50 })
  crm: string;

  @ManyToOne(() => Specialist)
  @JoinColumn({ name: 'crm' })
  Specialist: Specialist;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
