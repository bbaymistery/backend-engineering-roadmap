// 📄 exceptions.example.ts - Built-in NestJS HTTP Exceptions
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

// 1. Xüsusi (Custom) Exception Yaradılması
export class CustomBusinessException extends HttpException {
  constructor(message: string) {
    super(
      {
        status: HttpStatus.PAYMENT_REQUIRED,
        error: 'PAYMENT_REQUIRED_ERROR',
        message: message,
      },
      HttpStatus.PAYMENT_REQUIRED,
    );
  }
}

@Injectable()
export class UserService {
  private users = [
    { id: 1, name: 'Ali', email: 'ali@example.com', isActive: true },
    { id: 2, name: 'Vəli', email: 'veli@example.com', isActive: false },
  ];

  // 1. NotFoundException (404)
  getUserById(id: number) {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      // 🚨 Məlumat tapılmadıqda 404 atırıq
      throw new NotFoundException(`ID-si ${id} olan istifadəçi tapılmadı!`);
    }
    return user;
  }

  // 2. ConflictException (409)
  createUser(email: string, name: string) {
    const exists = this.users.find((u) => u.email === email);
    if (exists) {
      // 🚨 E-poçt təkrarlandıqda 409 Conflict atırıq
      throw new ConflictException(`"${email}" e-poçtu artıq istifadə olunur!`);
    }
    const newUser = { id: Date.now(), name, email, isActive: true };
    this.users.push(newUser);
    return newUser;
  }

  // 3. ForbiddenException (403) & Custom Exception
  deleteUser(id: number, currentUserRole: string) {
    if (currentUserRole !== 'ADMIN') {
      // 🚨 İcazə olmadıqda 403 Forbidden atırıq
      throw new ForbiddenException('Bu istifadəçini silməyə icazəniz yoxdur!');
    }
    return { success: true, message: 'İstifadəçi silindi.' };
  }
}
