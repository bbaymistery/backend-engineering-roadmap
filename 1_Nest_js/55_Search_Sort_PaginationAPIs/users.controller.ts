import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { PaginationQueryDto } from './dto/pagination.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 🔍 📊 GET /users?page=1&limit=10&search=ali&sortBy=name&sortOrder=ASC
   */
  @Get()
  async getUsers(@Query() query: PaginationQueryDto) {
    return this.usersService.findAll(query);
  }
}
