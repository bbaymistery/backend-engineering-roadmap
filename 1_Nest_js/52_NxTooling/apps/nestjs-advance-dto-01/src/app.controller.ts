import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from '@packages/shared-dto';

@Controller('dto-test')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('info')
  getInfo() {
    return this.appService.getInfo();
  }

  @Post('validate-user')
  validateUser(@Body() createUserDto: CreateUserDto) {
    return {
      success: true,
      validatedData: createUserDto,
      source: 'nestjs-advance-dto-01',
    };
  }
}
