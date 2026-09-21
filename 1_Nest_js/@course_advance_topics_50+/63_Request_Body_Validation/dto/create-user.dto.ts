import {
  IsString,
  IsEmail,
  IsInt,
  MinLength,
  MaxLength,
  IsEnum,
  IsOptional,
  Min,
  Max,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST',
}

export class AddressDto {
  @IsString({ message: 'Şəhər mətni düzgün daxil edilməlidir' })
  city: string;

  @IsString({ message: 'Küçə mətni düzgün daxil edilməlidir' })
  street: string;
}

export class CreateUserDto {
  /**
   * 1️⃣ Ad və Soyad Validation
   */
  @IsString({ message: 'Ad mətni (string) olmalıdır' })
  @MinLength(2, { message: 'Ad minimum 2 simvol olmalıdır' })
  @MaxLength(50, { message: 'Ad maksimum 50 simvol ola bilər' })
  name: string;

  /**
   * 2️⃣ Email Validation
   */
  @IsEmail({}, { message: 'Düzgün email ünvanı daxil edin (məs: user@example.com)' })
  email: string;

  /**
   * 3️⃣ Şifrə (Password) Validation
   */
  @IsString()
  @MinLength(6, { message: 'Şifrə minimum 6 simvoldan ibarət olmalıdır' })
  password: string;

  /**
   * 4️⃣ Yaş (Age) - Sayısal Məhdudiyyət
   */
  @IsInt({ message: 'Yaş tam ədəd (integer) olmalıdır' })
  @Min(18, { message: 'İstifadəçinin yaşı minimum 18 olmalıdır' })
  @Max(120, { message: 'Düzgün yaş aralığı daxil edin' })
  age: number;

  /**
   * 5️⃣ Enum Validation (Rol)
   */
  @IsEnum(UserRole, { message: 'Rol yalnız ADMIN, USER və ya GUEST ola bilər' })
  role: UserRole;

  /**
   * 6️⃣ Seçimli (Optional) Sahə
   */
  @IsOptional()
  @IsString({ message: 'Bio mətn formatında olmalıdır' })
  bio?: string;

  /**
   * 7️⃣ İç-içə Obyekt Validation (Nested Objects)
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;
}
