import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Stage } from './stage.enum';
import { AppConfigService } from './config.service';

@Global() // 🌐 Modulu qlobal edir ki, bütün layihədə təkrar import etmədən istifadə olunsun
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true, // 💡 NestJS-də dəyişənlərin bir-birini genişləndirməsini aktivləşdirir (APP_URL=${HOST}:${PORT})
      envFilePath:
        process.env.STAGE === Stage.LOCAL
          ? ['.env.local']
          : ['.env.production', '.env'],
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
