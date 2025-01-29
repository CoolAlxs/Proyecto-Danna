import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from './entities/role.entity';

@Module({
  providers: [RolesService],
  imports: [TypeOrmModule.forFeature([Roles])],
  controllers: [RolesController],
  exports: [RolesService],
})
export class RolesModule {}
