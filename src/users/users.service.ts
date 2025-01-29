import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entity';
import { PersonsService } from '../persons/persons.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from '../roles/roles.service';
import { Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  Logger = new Logger('UsersService');
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private RolesService: RolesService,
    private personsService: PersonsService,
  ) {}

  // Crear un nuevo usuario, persona e información médica
  async create(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        +process.env.SALT_ROUNDS,
      );

      const usernameExist = await this.usersRepository.findOneBy({
        username: createUserDto.username,
      });

      if (usernameExist) {
        throw new ConflictException('Username already exists');
      }

      const person = await this.personsService.create({
        ...createUserDto,
      });

      const role = await this.RolesService.findOneByName(createUserDto.role);
      if (!role) {
        throw new BadRequestException('Role not found');
      }

      // Crear el usuario
      const user = this.usersRepository.create({
        person: person.person,
        role: role,
        username: createUserDto.username,
        password: hashedPassword,
        createdAt: new Date(),
      });

      await this.usersRepository.save(user);
      return {
        user_ID: user.user_ID,
        username: user.username,
        role: user.role.role,
        person: {
          person_ID: user.person.person_ID,
          name: user.person.name,
          lastName: user.person.lastName,
          email: user.person.email,
          cedula: user.person.cedula,
          address: user.person.address,
        },
        medicalInformation: {
          medicalInfo_ID: user.person.medicalInformation.medicalInfo_ID,
          bloodType: user.person.medicalInformation.bloodType,
          allergies: user.person.medicalInformation.allergies,
          medicines: user.person.medicalInformation.medicines,
          medicalNotes: user.person.medicalInformation.medicalNotes,
          organDonor: user.person.medicalInformation.organDonor,
        },
        status: user.status,
      };
    } catch (error) {
      this.HandleError(error);
    }
  }

  async findAll() {
    try {
      const users = await this.usersRepository.find();
      return users.map((user) => ({
        user_ID: user.user_ID,
        username: user.username,
        role: user.role.role,
        person: {
          person_ID: user.person.person_ID,
          name: user.person.name,
          lastName: user.person.lastName,
          email: user.person.email,
          cedula: user.person.cedula,
          address: user.person.address,
        },
        medicalInformation: {
          medicalInfo_ID: user.person.medicalInformation.medicalInfo_ID,
          bloodType: user.person.medicalInformation.bloodType,
          allergies: user.person.medicalInformation.allergies,
          medicines: user.person.medicalInformation.medicines,
          medicalNotes: user.person.medicalInformation.medicalNotes,
          organDonor: user.person.medicalInformation.organDonor,
        },
        status: user.status,
      }));
    } catch (error) {
      this.HandleError(error);
    }
  }

  async findByEmail(email: string) {
    try {
      const person = await this.personsService.findByEmail(email);
      const user = await this.usersRepository.findOneBy({
        person,
        status: 'Active',
      });
      if (!user) throw new BadRequestException('User not found');
      return user;
    } catch (error) {
      this.HandleError(error);
    }
  }

  async comparePassword(password: string, hashedPassword: string) {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) throw new BadRequestException('Invalid password');
  }

  // Buscar un usuario por su ID
  async findOne(user_ID: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: { user_ID },
        relations: ['role', 'person'],
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }
      return {
        user_ID: user.user_ID,
        username: user.username,
        role: user.role.role,
        person: {
          person_ID: user.person.person_ID,
          name: user.person.name,
          lastName: user.person.lastName,
          email: user.person.email,
          cedula: user.person.cedula,
          address: user.person.address,
        },
        medicalInformation: {
          medicalInfo_ID: user.person.medicalInformation.medicalInfo_ID,
          bloodType: user.person.medicalInformation.bloodType,
          allergies: user.person.medicalInformation.allergies,
          medicines: user.person.medicalInformation.medicines,
          medicalNotes: user.person.medicalInformation.medicalNotes,
          organDonor: user.person.medicalInformation.organDonor,
        },
        status: user.status,
      };
    } catch (error) {
      this.HandleError(error);
    }
  }

  // Actualizar un usuario
  async update(user_ID: string, updateUserDto: any) {
    try {
      const user = await this.findOne(user_ID);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      const updatedUser = await this.usersRepository.update(user_ID, {
        ...updateUserDto,
        updatedAt: new Date(),
      });
      return updatedUser;
    } catch (error) {
      this.HandleError(error);
    }
  }

  // Eliminar un usuario
  async remove(user_ID: string) {
    try {
      const user = await this.findOne(user_ID);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      const deletedUser = await this.usersRepository.update(user_ID, {
        status: 'Deleted',
        deletedAt: new Date(),
      });
      return deletedUser;
    } catch (error) {
      this.HandleError(error);
    }
  }

  private HandleError(error: any) {
    if (error.code === '23505') {
      if (error.detail.includes('username')) {
        throw new ConflictException('Username already exists');
      }
    }
    if (error.message === 'Username already exists') {
      throw new ConflictException('Username already exists');
    }
    if (error.message === 'Cedula already exists') {
      throw new ConflictException('Cedula already exists');
    }
    if (error.message === 'Email already exists') {
      throw new ConflictException('Email already exists');
    }
    if (error.message === 'Person not found') {
      throw new NotFoundException('Person not found');
    }
    if (error.message === 'Role not found') {
      throw new NotFoundException('Role not found');
    }
    if (error.message === 'User not found') {
      throw new NotFoundException('User not found');
    }
  }
}
