import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('validation-demo')
export class UserValidationDemoController {
  /**
   * 1️⃣ Full Request Body Validation (@Body() with DTO)
   * 
   * Klient tərəfindən göndərilən JSON payload-ı tam şəkildə yoxlayır.
   * Əgər validation keçməzsə, NestJS avtomatik 400 Bad Request və xəta siyahısı qaytarır.
   */
  @Post('users')
  @HttpCode(HttpStatus.CREATED)
  createUser(@Body() createUserDto: CreateUserDto) {
    return {
      success: true,
      message: 'İstifadəçi uğurla yoxlanıldı və qeydiyyata alındı!',
      data: createUserDto,
    };
  }

  /**
   * 2️⃣ Single Body Field Extraction (@Body('fieldName'))
   * 
   * Bəzən bütün body-ni deyil, yalnız 1 sahəni götürmək istəyirik.
   */
  @Post('quick-email')
  checkEmailOnly(@Body('email') email: string) {
    return {
      receivedEmail: email,
    };
  }

  /**
   * 3️⃣ Route-Level ValidationPipe Customization
   * 
   * Müəyyən bir endpoint üçün xüsusi ValidationPipe parametrləri təyin etmək (məs: extra field-ləri qadağan etmək):
   */
  @Post('strict-user')
  @UsePipes(
    new ValidationPipe({
      whitelist: true, // DTO-da olmayan sahələri təmizləyir
      forbidNonWhitelisted: true, // DTO-da olmayan sahə gəldikdə XƏTA çıxarır (400)
      transform: true, // Payload-ı tam DTO klassının instansiyasına çevirir
    }),
  )
  createStrictUser(@Body() createUserDto: CreateUserDto) {
    return {
      message: 'Strict validation keçildi!',
      user: createUserDto,
    };
  }
}
