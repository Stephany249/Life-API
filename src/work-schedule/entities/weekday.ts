import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Weekday extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ nullable: false, type: 'varchar', length: 20 })
  name: string;
}
