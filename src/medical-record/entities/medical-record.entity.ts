import { Answers } from 'questions-answers/entities/answers.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from 'users/entities/user.entity';

@Entity()
export class MedicalRecord extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: false, type: 'varchar', length: 20 })
  role: string;

  @Column({ nullable: false, type: 'int2' })
  question1: number;

  @ManyToOne(() => Answers)
  @JoinColumn({ name: 'question1' })
  answers1: Answers;

  @Column({ nullable: false, type: 'int2' })
  question2: number;

  @ManyToOne(() => Answers)
  @JoinColumn({ name: 'question2' })
  answers2: Answers;

  @Column({ nullable: false, type: 'int2' })
  question3: number;

  @ManyToOne(() => Answers)
  @JoinColumn({ name: 'question3' })
  answers3: Answers;

  @Column({ nullable: false, type: 'int2' })
  question4: number;

  @ManyToOne(() => Answers)
  @JoinColumn({ name: 'question4' })
  answers4: Answers;

  @Column({ nullable: false, type: 'int2' })
  question5: number;

  @ManyToOne(() => Answers)
  @JoinColumn({ name: 'question5' })
  answers5: Answers;

  @Column({ nullable: false, type: 'varchar'})
  question6: string;

  @Column({ nullable: false, type: 'int2' })
  question7: number;

  @ManyToOne(() => Answers)
  @JoinColumn({ name: 'question7' })
  answers7: Answers;

  @Column({ nullable: true, type: 'int2' })
  question8: number;

  @ManyToOne(() => Answers)
  @JoinColumn({ name: 'question8' })
  answers8: Answers;

  @Column({ nullable: false, type: 'varchar'})
  question9: string;

  @Column({ nullable: true, type: 'int2' })
  question10: number;

  @ManyToOne(() => Answers)
  @JoinColumn({ name: 'question10' })
  answers10: Answers;

  @Column({ nullable: true })
  score: number;

  @Column({ nullable: true })
  scale: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
