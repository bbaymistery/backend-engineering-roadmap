import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthModule } from './auth.module';

@Module({
  // 🔄 Modul səviyyəsində forwardRef() istifadəsi:
  imports: [forwardRef(() => AuthModule)],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
