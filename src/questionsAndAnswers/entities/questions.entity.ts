import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Questions extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false, type: 'varchar', length: 200 })
  question: string;

  @Column({ nullable: false, type: 'varchar', length: 20 })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
