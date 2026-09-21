import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsString({ message: 'Ad mətn olmalıdır' })
  @MinLength(2, { message: 'Ad minimum 2 simvol olmalıdır' })
  @MaxLength(100, { message: 'Ad maksimum 100 simvol ola bilər' })
  name: string;

  @IsEmail({}, { message: 'Düzgün email formatı daxil edin' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Şifrə minimum 6 simvol olmalıdır' })
  password: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Düzgün rol seçin (ADMIN, USER, MODERATOR)' })
  role?: UserRole;
}
