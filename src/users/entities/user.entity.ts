import { Persons } from 'src/persons/entities/person.entity';
import { Roles } from 'src/roles/entities/role.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  user_ID: string;

  @OneToOne(() => Persons, { eager: true, nullable: false })
  @JoinColumn({ name: 'person_ID' })
  person: Persons;

  @ManyToOne(() => Roles, { eager: true, nullable: false })
  @JoinColumn({ name: 'role_ID' })
  role: Roles;

  @Column('varchar', { length: 100, unique: true })
  username: string;

  @Column('varchar')
  password: string;

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
