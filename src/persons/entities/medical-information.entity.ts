import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Persons } from './person.entity';

@Entity()
export class MedicalInformation {
  @PrimaryGeneratedColumn('uuid')
  medicalInfo_ID: string;

  @OneToOne(() => Persons)
  @JoinColumn({ name: 'person_ID' })
  person_ID: string;

  @Column('enum', {
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  })
  bloodType: string;

  @Column('text')
  allergies: string;

  @Column('text')
  medicines: string;

  @Column('text')
  medicalNotes: string;

  @Column('boolean')
  organDonor: boolean;

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
