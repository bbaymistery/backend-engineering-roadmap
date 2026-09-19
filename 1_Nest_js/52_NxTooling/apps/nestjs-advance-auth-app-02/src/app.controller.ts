import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from '@packages/shared-dto';

@Controller('auth')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('status')
  getStatus() {
    return this.appService.getStatus();
  }

  @Post('login')
  login(@Body() dto: CreateUserDto) {
    return {
      message: 'Login successful via Shared DTO!',
      user: dto,
    };
  }
}
