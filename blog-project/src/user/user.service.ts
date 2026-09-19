import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService, UserRecord } from '../database/database.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';

@Injectable()
export class UserService {
  // DatabaseService-i Dependency Injection ilə bura daxil edirik
  constructor(private readonly databaseService: DatabaseService) {}

  getAllUsers(): UserRecord[] {
    return this.databaseService.getUsers();
  }

  getUserById(id: number): UserRecord {
    const user = this.databaseService.getUserById(id);
    if (!user) {
      throw new NotFoundException(`ID-si ${id} olan istifadəçi tapılmadı!`);
    }
    return user;
  }

  createUser(createUserDto: CreateUserDto): UserRecord {
    return this.databaseService.addUser(createUserDto.name, createUserDto.email);
  }
}
