import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

enum BloodType {
  APlus = 'A+',
  AMinus = 'A-',
  BPlus = 'B+',
  BMinus = 'B-',
  ABPlus = 'AB+',
  ABMinus = 'AB-',
  OPlus = 'O+',
  OMinus = 'O-',
}

export class CreatePersonDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  @Transform(({ value }) => value.trim())
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  @Transform(({ value }) => value.trim())
  lastName: string;

  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Type(() => Number)
  cedula: number;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @IsEnum(BloodType)
  bloodType: BloodType;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  @Transform(({ value }) => value.trim())
  allergies: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @Transform(({ value }) => value.trim())
  medicines: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @Transform(({ value }) => value.trim())
  medicalNotes: string;

  @IsBoolean()
  @IsNotEmpty()
  organDonor: boolean;
}
