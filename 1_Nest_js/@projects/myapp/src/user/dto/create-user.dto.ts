import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'Vəli Məmmədov',
    description: 'İstifadəçinin tam adı',
  })
  name: string;

  @ApiProperty({
    example: 'veli@example.com',
    description: 'İstifadəçinin elektron poçt ünvanı',
  })
  email: string;
}
