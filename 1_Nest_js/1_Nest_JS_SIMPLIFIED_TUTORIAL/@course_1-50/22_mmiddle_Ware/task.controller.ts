// 📄 src/domain/task/task.controller.ts
import {
  Controller,
  Get,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';

@Controller('/api/v1/tasks')
export class TaskController {

  // 📍 Hər kəs üçün açıq olan Endpoint
  @Get('public')
  @HttpCode(HttpStatus.OK)
  getPublicTasks() {
    return {
      message: 'Bu hər kəs üçün açıq olan tapşırıqlar siyahısıdır.',
      tasks: ['Dərs oxumaq', 'İdman etmək'],
    };
  }

  // 📍 Sırf Guard tərəfindən 'admin' rolu yoxlanılan qorunan Endpoint (Şəkil 4-dəki kimi!)
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard) // 👈 Təhlükəsizlik Guard-ı bura tətbiq olunub!
  async findAll() {
    return [
      { id: 1, title: 'Server İnfrastrukturunu Qurnız', status: 'IN_PROGRESS' },
      { id: 2, title: 'Verilənlər Bazasını Backup Edin', status: 'OPEN' },
    ];
  }
}
