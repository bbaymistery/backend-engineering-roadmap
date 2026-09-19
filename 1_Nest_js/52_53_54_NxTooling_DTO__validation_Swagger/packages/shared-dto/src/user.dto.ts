import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'Admin',
  USER = 'User',
  GUEST = 'Guest',
}

export class CreateUserDto {
  @ApiProperty({
    description: 'İstifadəçinin tam adı',
    example: 'Aytac Aliyeva',
    minLength: 2,
  })
  @IsString()
  @IsNotEmpty({ message: 'Ad boş ola bilməz!' })
  @MinLength(2, { message: 'Ad ən azı 2 simvoldan ibarət olmalıdır!' })
  name: string;

  @ApiProperty({
    description: 'İstifadəçinin email ünvanı',
    example: 'aytac@example.com',
  })
  @IsEmail({}, { message: 'Düzgün email ünvanı daxil edin!' })
  @IsNotEmpty({ message: 'Email məcburidir!' })
  email: string;

  @ApiProperty({
    enum: UserRole,
    description: 'İstifadəçinin rolu (Admin, User və ya Guest)',
    example: UserRole.ADMIN,
  })
  @IsEnum(UserRole, { message: 'Rol yalnız Admin, User və ya Guest ola bilər!' })
  role: UserRole;

  @ApiPropertyOptional({
    description: 'İstifadəçinin yaşı (Ən azı 18)',
    example: 25,
    minimum: 18,
    maximum: 100,
  })
  @IsOptional()
  @IsInt({ message: 'Yaş tam ədəd olmalıdır!' })
  @Min(18, { message: 'Yaş ən azı 18 olmalıdır!' })
  @Max(100, { message: 'Yaş 100-dən böyük ola bilməz!' })
  age?: number;
}

export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'İstifadəçi ID' })
  id: number;

  @ApiProperty({ example: 'Aytac Aliyeva', description: 'İstifadəçinin adı' })
  name: string;

  @ApiProperty({ example: 'aytac@example.com', description: 'Email' })
  email: string;

  @ApiProperty({ enum: UserRole, example: UserRole.ADMIN })
  role: UserRole;

  @ApiPropertyOptional({ example: 25 })
  age?: number;

  @ApiProperty({ example: '2026-09-19T17:30:00.000Z' })
  createdAt: Date;
}
