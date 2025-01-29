import { Module } from '@nestjs/common';
import { PersonsService } from './persons.service';
import { PersonsController } from './persons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Persons } from './entities/person.entity';
import { MedicalInformation } from './entities/medical-information.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Persons, MedicalInformation])],
  providers: [PersonsService],
  controllers: [PersonsController],
  exports: [PersonsService],
})
export class PersonsModule {}
