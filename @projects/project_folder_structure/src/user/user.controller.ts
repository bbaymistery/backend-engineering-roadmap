import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';

@Controller('users') // Endpoint: http://localhost:3000/users
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get() // GET http://localhost:3000/users
  getUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id') // GET http://localhost:3000/users/1
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  @Post() // POST http://localhost:3000/users  Body: { "name": "Vəli", "email": "veli@example.com" }
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
}
