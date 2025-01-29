import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles)
    private rolesRepository: Repository<Roles>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    try {
      const role = this.rolesRepository.create({
        ...createRoleDto,
        createdAt: new Date(),
      });
      return await this.rolesRepository.save(role);
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async findAll() {
    try {
      return await this.rolesRepository.find();
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async findOne(id: string) {
    try {
      const role = await this.rolesRepository.findOneBy({ role_ID: id });
      console.log(role);
      if (!role) {
        throw new NotFoundException('Role not found');
      }
      return role;
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async findOneByName(name: string) {
    try {
      const role = await this.rolesRepository.findOneBy({ role: name });
      if (!role) {
        throw new NotFoundException('Role not found');
      }
      return role;
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    try {
      const role = await this.findOne(id);

      const update = await this.rolesRepository.update(role, {
        ...updateRoleDto,
        updatedAt: new Date(),
      });

      return update;
    } catch (error) {
      this.handleErrors(error);
    }
  }

  async remove(id: string) {
    try {
      const role = await this.findOne(id);
      const remove = await this.rolesRepository.update(role, {
        status: 'Deleted',
        deletedAt: new Date(),
      });
      return remove;
    } catch (error) {
      this.handleErrors(error);
    }
  }

  handleErrors(error: any) {
    if (error.code === '23505') {
      throw new ConflictException('Role already exists');
    }
    if (error.message === 'Role not found') {
      throw new NotFoundException('Role not found');
    }
    throw new InternalServerErrorException(error);
  }
}
