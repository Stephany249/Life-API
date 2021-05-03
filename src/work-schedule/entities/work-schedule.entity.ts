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
  OneToMany,
} from 'typeorm';
import { Weekday } from './weekday';

@Entity()
export class WorkSchedule extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ nullable: false, type: 'int2' })
  weekdayId: number;

  @ManyToOne(() => Weekday)
  @JoinColumn({ name: 'weekdayId' })
  Weekday: Weekday;

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
