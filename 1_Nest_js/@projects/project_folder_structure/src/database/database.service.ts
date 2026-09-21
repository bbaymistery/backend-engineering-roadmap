import { Injectable, OnModuleInit } from '@nestjs/common';

export interface UserRecord {
  id: number;
  name: string;
  email: string;
}

@Injectable()
export class DatabaseService implements OnModuleInit {
  // Bazanı simulyasiya edən sadə massiv (Mock Database)
  private users: UserRecord[] = [];

  onModuleInit() {
    // Layihə işə düşəndə bazaya ilkin məlumatlar əlavə edirik
    this.users = [
      { id: 1, name: 'Ali Mammadov', email: 'ali@example.com' },
      { id: 2, name: 'Leyla Həsənova', email: 'leyla@example.com' },
    ];
    console.log('[DatabaseService] 🗄️  Mock Verilənlər Bazası uğurla qoşuldu.');
  }

  /**
   * Bütün istifadəçiləri qaytarır
   */
  getUsers(): UserRecord[] {
    return this.users;
  }

  /**
   * ID-yə görə tek istifadəçi tapır
   */
  getUserById(id: number): UserRecord | undefined {
    return this.users.find((u) => u.id === id);
  }

  /**
   * Yeni istifadəçi əlavə edir
   */
  addUser(name: string, email: string): UserRecord {
    const newUser: UserRecord = {
      id: this.users.length + 1,
      name,
      email,
    };
    this.users.push(newUser);
    return newUser;
  }
}
