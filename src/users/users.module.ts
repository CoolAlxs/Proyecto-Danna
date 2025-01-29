import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { RolesModule } from 'src/roles/roles.module';
import { PersonsModule } from 'src/persons/persons.module';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([Users]), RolesModule, PersonsModule],
  exports: [UsersService],
})
export class UsersModule {}
