import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Questions } from './questions.entity';

@Entity()
export class Answers extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false, type: 'varchar', length: 40 })
  answer: string;

  @Column({ nullable: false, type: 'int2' })
  score: number;

  @Column({ nullable: false, type: 'int2' })
  questionId: number;

  @ManyToOne(() => Questions)
  @JoinColumn({ name: 'questionId' })
  question: Questions;

  @Column({ nullable: false, type: 'varchar', length: 20 })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
