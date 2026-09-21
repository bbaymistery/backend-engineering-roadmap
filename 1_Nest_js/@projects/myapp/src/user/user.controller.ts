import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UserService } from './user.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';

@ApiTags('users') // Swagger UI səhifəsində 'users' başlığı altında qruplaşdırır
@Controller('users') // Endpoint: http://localhost:3000/users
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Bütün istifadəçilərin siyahısını almaq' })
  @ApiResponse({ status: 200, description: 'İstifadəçilər siyahısı uğurla qaytarıldı.' })
  getUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID-yə görə tək bir istifadəçini tapmaq' })
  @ApiParam({ name: 'id', example: 1, description: 'İstifadəçinin unikal ID nömrəsi' })
  @ApiResponse({ status: 200, description: 'İstifadəçi tapıldı.' })
  @ApiResponse({ status: 404, description: 'İstifadəçi tapılmadı.' })
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Yeni istifadəçi yaratmaq' })
  @ApiResponse({ status: 201, description: 'İstifadəçi uğurla yaradıldı.' })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }
}
