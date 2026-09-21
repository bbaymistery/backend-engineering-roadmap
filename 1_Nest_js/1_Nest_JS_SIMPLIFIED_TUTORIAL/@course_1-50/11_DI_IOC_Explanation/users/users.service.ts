import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [
    { id: 1, name: 'Ali Mammadov' },
    { id: 2, name: 'Leyla Həsənova' },
  ];

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    return this.users.find((u) => u.id === id);
  }
}
