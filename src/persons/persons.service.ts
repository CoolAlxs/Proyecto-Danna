import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Persons } from './entities/person.entity';
import { MedicalInformation } from './entities/medical-information.entity';

@Injectable()
export class PersonsService {
  constructor(
    @InjectRepository(Persons)
    private personsRepository: Repository<Persons>,
    @InjectRepository(MedicalInformation)
    private medicalInformationRepository: Repository<MedicalInformation>,
  ) {}

  // Crear una nueva persona y su información médica
  async create(createPersonDto: CreatePersonDto) {
    try {
      const person = this.personsRepository.create({
        ...createPersonDto,
        createdAt: new Date(),
      });
      await this.personsRepository.save(person);

      const medicalInformation = this.medicalInformationRepository.create({
        ...createPersonDto,
        person_ID: person.person_ID,
        createdAt: new Date(),
      });
      await this.medicalInformationRepository.save(medicalInformation);

      return { person, medicalInformation };
    } catch (error) {
      this.HandleError(error);
    }
  }

  async findByEmail(email: string) {
    try {
      const person = await this.personsRepository.findOneBy({
        email,
        status: 'Active',
      });
      if (!person) throw new BadRequestException('Person not found');
      return person;
    } catch (error) {
      this.HandleError(error);
    }
  }

  async findAll() {
    try {
      const persons = await this.personsRepository.find();
      return persons;
    } catch (error) {
      this.HandleError(error);
    }
  }

  async findOne(id: string) {
    try {
      const person = await this.personsRepository.findOneBy({ person_ID: id });
      if (!person) {
        throw new BadRequestException('Person not found');
      }
      return person;
    } catch (error) {
      this.HandleError(error);
    }
  }

  // Buscar todas las personas con información médica
  async findAllWithMedicalInfo() {
    try {
      const persons = await this.personsRepository.find();
      return persons;
    } catch (error) {
      this.HandleError(error);
    }
  }

  // Buscar todas las personas sin información médica
  async findAllWithoutMedicalInfo() {
    try {
      const persons = await this.personsRepository.find();

      return persons.map((person) => ({
        person_ID: person.person_ID,
        name: person.name,
        lastName: person.lastName,
        email: person.email,
        cedula: person.cedula,
        address: person.address,
        status: person.status,
      }));
    } catch (error) {
      this.HandleError(error);
    }
  }

  // Buscar información médica por persona
  async findMedicalInfoByPersonId(person_ID: string) {
    try {
      const medicalInfo = await this.medicalInformationRepository.findOne({
        where: { person_ID },
      });
      if (!medicalInfo) {
        throw new BadRequestException('Medical information not found');
      }
      return medicalInfo;
    } catch (error) {
      this.HandleError(error);
    }
  }

  // Actualizar la información médica de una persona
  async updateMedicalInfo(person_ID: string, updatePersonDto: UpdatePersonDto) {
    try {
      const medicalInfo = await this.medicalInformationRepository.findOne({
        where: { person_ID },
      });
      if (!medicalInfo) {
        throw new BadRequestException('Medical information not found');
      }

      const updatedMedicalInfo = await this.medicalInformationRepository.update(
        medicalInfo.medicalInfo_ID,
        {
          ...updatePersonDto,
          updatedAt: new Date(),
        },
      );
      return updatedMedicalInfo;
    } catch (error) {
      this.HandleError(error);
    }
  }

  // Actualizar los detalles de una persona
  async update(id: string, updatePersonDto: UpdatePersonDto) {
    try {
      await this.findOne(id);
      const updatedPerson = await this.personsRepository.update(id, {
        ...updatePersonDto,
        updatedAt: new Date(),
      });

      return updatedPerson;
    } catch (error) {
      this.HandleError(error);
    }
  }

  // Eliminar una persona y cambiar el estado de la información médica
  async remove(id: string) {
    try {
      await this.findOne(id);
      // Cambiar el estado de la persona
      const deletedPerson = await this.personsRepository.update(id, {
        status: 'Deleted',
        deletedAt: new Date(),
      });

      // Cambiar el estado de la información médica
      const medicalInfo = await this.medicalInformationRepository.findOne({
        where: { person_ID: id },
      });

      if (medicalInfo) {
        await this.medicalInformationRepository.update(
          medicalInfo.medicalInfo_ID,
          {
            status: 'Deleted',
            deletedAt: new Date(),
          },
        );
      }

      return deletedPerson;
    } catch (error) {
      this.HandleError(error);
    }
  }

  private HandleError(error: any) {
    if (error.code === '23505') {
      if (error.detail.includes('cedula')) {
        throw new ConflictException('Cedula already exists');
      }
      if (error.detail.includes('email')) {
        throw new ConflictException('Email already exists');
      }
    }
    if (error.message === 'Person not found') {
      throw new BadRequestException('Person not found');
    }
    throw new InternalServerErrorException(error);
  }
}
