import { IsString, IsNotEmpty, MinLength, MaxLength, IsArray, IsOptional } from 'class-validator';

export class CreatePostDto {
  @IsString({ message: 'Başlıq mətn olmalıdır' })
  @IsNotEmpty({ message: 'Başlıq boş ola bilməz' })
  @MinLength(3, { message: 'Başlıq minimum 3 simvol olmalıdır' })
  @MaxLength(100, { message: 'Başlıq maksimum 100 simvol ola bilər' })
  title: string;

  @IsString({ message: 'Məzmun mətn olmalıdır' })
  @IsNotEmpty({ message: 'Məzmun boş ola bilməz' })
  @MinLength(10, { message: 'Məzmun minimum 10 simvol olmalıdır' })
  content: string;

  @IsOptional()
  @IsArray({ message: 'Teqlər massiv (array) formatında olmalıdır' })
  @IsString({ each: true, message: 'Hər bir teq mətn olmalıdır' })
  tags?: string[];
}
