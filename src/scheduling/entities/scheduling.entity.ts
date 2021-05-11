import {
  BaseEntity,
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { MedicalRecord } from '../../medical-record/entities/medical-record.entity';
import { Specialist } from '../../specialist/entities/specialist.entity';

@Entity()
export class Scheduling extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ nullable: true })
  crmSpecialist: string;

  @ManyToOne(() => Specialist)
  @JoinColumn({ name: 'crmSpecialist' })
  specialist: Specialist;

  @Column({ nullable: false })
  date: Date;

  @Column({ nullable: false, type: 'varchar' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: false, type: 'int2' })
  medicalRecordsId: number;

  @ManyToOne(() => MedicalRecord)
  @JoinColumn({ name: 'medicalRecordsId' })
  medicalRecordId: MedicalRecord;

  @Column({ nullable: false, type: 'varchar' })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true, type: 'date' })
  canceledAt: Date;
}
