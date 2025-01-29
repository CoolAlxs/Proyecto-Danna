import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Roles {
  @PrimaryGeneratedColumn('uuid')
  role_ID: string;

  @Column('varchar', { length: 100, nullable: false, unique: true })
  role: string;

  @Column('varchar', { length: 200, nullable: false })
  description: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('timestamp', { nullable: true })
  updatedAt: Date;

  @Column('enum', {
    enum: ['Active', 'Inactive', 'Deleted'],
    default: 'Active',
  })
  status: string;

  @Column('timestamp', { nullable: true })
  deletedAt: Date;
}
