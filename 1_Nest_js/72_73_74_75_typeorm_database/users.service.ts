import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * 📦 Topic 75: TypeORM Repository Pattern Və CRUD Əməliyyatları
 * 
 * `@InjectRepository(UserEntity)` - TypeORM tərəfindən idarə olunan `users` cədvəl parametrlərini
 * bu servisə daxil edir. `Repository<UserEntity>` bazaya SQL sorğuları yazmağa imkan verir.
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }

  /**
   * 🟢 1. YENİ İSTİFADƏÇİ YARATMAQ (CREATE)
   * 
   * - `create()`: Yalnız RAM-da Entity instansiyası yaradır (DB-yə hələ yazmır).
   * - `save()`: Obyekti PostgreSQL bazasına SQL `INSERT INTO users...` ilə yazır.
   */
  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    // A. Email-in bazada mövcudluğunu yoxlayırıq:
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Bu email ünvanı artıq istifadə olunur!');
    }

    // B. RAM-da obyekt yaradırıq:
    const newUser = this.userRepository.create(createUserDto);

    // C. Bazaya yazırıq və nəticəni qaytarırıq:
    return await this.userRepository.save(newUser);
  }

  /**
   * 🔵 2. BÜTÜN İSTİFADƏÇİLƏRİ ALMAQ (FIND ALL)
   * 
   * `find()`: SQL `SELECT * FROM users WHERE isActive = true` icra edir.
   */
  async findAllUsers(): Promise<UserEntity[]> {
    return await this.userRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' }, // Ən son yaradılanlar birinci
    });
  }

  /**
   * 🔵 3. TEK İSTİFADƏÇİNİ ID İLƏ ALMAQ (FIND ONE)
   * 
   * `findOne()`: SQL `SELECT * FROM users WHERE id = :id` icra edir.
   */
  async findUserById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`${id} ID-li istifadəçi tapılmadı!`);
    }

    return user;
  }

  /**
   * 🟡 4. İSTİFADƏÇİNİ YENİLƏMƏK (UPDATE)
   * 
   * `update(id, partialDto)`: SQL `UPDATE users SET name = ... WHERE id = :id` icra edir.
   */
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    // Əvvəlcə istifadəçinin varlığını yoxlayırıq:
    await this.findUserById(id);

    // SQL UPDATE əməliyyatı:
    await this.userRepository.update(id, updateUserDto);

    // Yenilənmiş məlumatı bazadan yenidən oxuyub qaytarırıq:
    return await this.findUserById(id);
  }

  /**
   * 🔴 5. YUMŞAQ SİLMƏ (SOFT DELETE)
   * 
   * `softDelete(id)`: Məlumatı bazadan SİLMİR!
   * Yalnız `deletedAt` sütununa cari tarixi yazır (SQL `UPDATE users SET deletedAt = NOW() WHERE id = :id`).
   */
  async softRemoveUser(id: number): Promise<void> {
    const user = await this.findUserById(id);
    await this.userRepository.softDelete(user.id);
  }

  /**
   * 💥 6. BAZADAN TAM SİLMƏ (HARD DELETE)
   * 
   * `delete(id)`: Məlumatı PostgreSQL bazasından HƏMİŞƏLİK SİLİR (SQL `DELETE FROM users WHERE id = :id`).
   */
  async hardRemoveUser(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`${id} ID-li istifadəçi silinmək üçün tapılmadı!`);
    }
  }
}
