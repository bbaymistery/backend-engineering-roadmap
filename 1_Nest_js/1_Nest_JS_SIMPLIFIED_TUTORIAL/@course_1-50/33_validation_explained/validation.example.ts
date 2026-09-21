import {
  IsString,
  IsEmail,
  IsInt,
  Min,
  Max,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';

// Enum tərifi
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

// ==========================================
// 1. DAXİLİ DTO (Nested DTO)
// ==========================================
export class AddressDto {
  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  street: string;
}

// ==========================================
// 2. ƏSAS DTO (Main DTO with Validation)
// ==========================================
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Ad ən az 2 simvol olmalıdır!' })
  name: string;

  @IsEmail({}, { message: 'Düzgün email ünvanı daxil edin!' })
  email: string;

  @IsInt()
  @Min(18, { message: 'Yaş minimum 18 olmalıdır!' })
  @Max(100)
  @Type(() => Number) // "25" string gələrsə number-ə çevirir
  age: number;

  @IsEnum(UserRole, { message: 'Rol yalnız ADMIN və ya USER ola bilər!' })
  role: UserRole;

  // 📍 Tək daxili obyekt validasiyası
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  // 📍 Məcburi olmayan obyektlər massivi validasiyası
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  previousAddresses?: AddressDto[];
}

// ==========================================
// 3. CONTROLLER
// ==========================================
@Controller('users')
export class UsersController {
  @Post()
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )
  createUser(@Body() dto: CreateUserDto) {
    return {
      message: 'İstifadəçi melumatları validasiyadan uğurla keçdi! ✅',
      data: dto,
    };
  }
}
