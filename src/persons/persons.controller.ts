import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { PersonsService } from './persons.service';

@Controller('persons')
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  // Crear una nueva persona y su información médica
  @Post()
  async create(@Body() createPersonDto: CreatePersonDto) {
    return await this.personsService.create(createPersonDto);
  }

  // Buscar todas las personas
  @Get()
  async findAll() {
    return await this.personsService.findAll();
  }

  // Buscar todas las personas con información médica
  @Get('with-medical-info')
  async findAllWithMedicalInfo() {
    return await this.personsService.findAllWithMedicalInfo();
  }

  // Buscar todas las personas sin información médica
  @Get('without-medical-info')
  async findAllWithoutMedicalInfo() {
    return await this.personsService.findAllWithoutMedicalInfo();
  }

  // Buscar información médica de una persona
  @Get(':person_ID/medical-info')
  async findMedicalInfoByPersonId(@Param('person_ID') person_ID: string) {
    return await this.personsService.findMedicalInfoByPersonId(person_ID);
  }

  // Actualizar los detalles de una persona
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePersonDto: UpdatePersonDto,
  ) {
    return await this.personsService.update(id, updatePersonDto);
  }

  // Actualizar la información médica de una persona
  @Put(':person_ID/medical-info')
  async updateMedicalInfo(
    @Param('person_ID') person_ID: string,
    @Body() updatePersonDto: UpdatePersonDto,
  ) {
    return await this.personsService.updateMedicalInfo(
      person_ID,
      updatePersonDto,
    );
  }

  // Eliminar una persona y actualizar el estado de la información médica
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.personsService.remove(id);
  }
}
