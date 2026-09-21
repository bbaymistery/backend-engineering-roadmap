import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

/**
 * 📦 TypeOrmModule.forFeature([UserEntity])
 * 
 * Bu registrasiya vasitəsilə TypeORM `UserEntity` repositorisini (`Repository<UserEntity>`)
 * NestJS DI konteynerinə tanıdır və `UsersService`-də @InjectRepository ilə istifadəyə hazır edir!
 */
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
