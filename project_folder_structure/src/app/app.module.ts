import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UserModule } from '../user/user.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { DatabaseModule } from '../database/database.module.js';
import { CoreModule } from '../core/core.module.js';
import { SharedModule } from '../shared/shared.module.js';
import { LibModule } from '../lib/lib.module.js';

@Module({
  imports: [
    UserModule,
    AuthModule,
    DatabaseModule,
    CoreModule,
    SharedModule,
    LibModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
