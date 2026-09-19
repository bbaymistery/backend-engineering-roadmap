import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AppService } from './app.service';
import { CreateUserDto, UserResponseDto } from '@packages/shared-dto';

@ApiTags('DTO Validation Test')
@Controller('dto-test')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('info')
  @ApiOperation({ summary: 'Servis status məlumatını gətirir' })
  @ApiResponse({ status: 200, description: 'Servis aktivdir' })
  getInfo() {
    return this.appService.getInfo();
  }

  @Post('validate-user')
  @ApiOperation({ summary: 'İstifadəçi məlumatlarını DTO Validation ilə yoxlayır və yaradır' })
  @ApiBody({ type: CreateUserDto, description: 'Yaradılacaq istifadəçi məlumatları' })
  @ApiResponse({ status: 201, description: 'İstifadəçi müvəffəqiyyətlə doğrulandı və yaradıldı', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Validation xətası (Daxil edilən məlumatlar bərbaddır)' })
  validateUser(@Body() createUserDto: CreateUserDto) {
    return {
      success: true,
      validatedData: createUserDto,
      source: 'nestjs-advance-dto-01',
    };
  }
}
