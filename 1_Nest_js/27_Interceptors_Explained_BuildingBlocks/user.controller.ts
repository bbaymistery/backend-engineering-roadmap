// 📄 user.controller.ts - Interceptor-ların Tətbiq Olunduğu Controller
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { LoggingInterceptor } from './logging.interceptor';
import { TransformInterceptor } from './transform.interceptor';
import { TimeoutInterceptor } from './timeout.interceptor';

@Controller('users')
@UseInterceptors(LoggingInterceptor, TransformInterceptor) // 👈 Controller səviyyəsində tətbiq
export class UserController {

  @Get()
  getAllUsers() {
    // Controller sadəcə xam data qaytarır:
    return [
      { id: 1, name: 'Ali' },
      { id: 2, name: 'Vəli' },
    ];
    // TransformInterceptor bunu avtomatik belə edəcək:
    // { data: [{...}, {...}], success: true, statusCode: 200, timestamp: "..." }
  }

  @Get('slow-endpoint')
  @UseInterceptors(TimeoutInterceptor)
  async getSlowData() {
    // Simulyasiya: 6 saniyəlik yavaş əməliyyat
    await new Promise((resolve) => setTimeout(resolve, 6000));
    return { message: 'Bu cavab çıxmayacaq, çünki 5s Timeout ləğv edəcək!' };
  }
}
