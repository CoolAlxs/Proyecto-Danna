import { MedicalInformation } from 'src/persons/entities/medical-information.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Persons {
  @PrimaryGeneratedColumn('uuid')
  person_ID: string;

  @Column('varchar', { length: 100, nullable: false })
  name: string;

  @Column('varchar', { length: 100, nullable: false })
  lastName: string;

  @Column('int', { unique: true, nullable: false })
  cedula: number;

  @Column('text', { unique: true, nullable: false })
  email: string;

  @Column('text')
  address: string;

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

  @OneToOne(
    () => MedicalInformation,
    (medicalInformation) => medicalInformation.person_ID,
    { eager: true },
  )
  medicalInformation: MedicalInformation;
}
