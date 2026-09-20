import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import {
  UsersV1Controller,
  AdminDashboardController,
} from './versioned-users.controller';

@Module({
  controllers: [UsersV1Controller, AdminDashboardController],
})
export class UserFeatureModule {}

/**
 * 7️⃣ RouterModule (NestJS İyerarxik Modul Routinqi)
 * 
 * Böyük monorepo və ya monolit layihələrdə modulları iyerarxik qovluq routinqinə salmaq üçün:
 */
@Module({
  imports: [
    UserFeatureModule,
    RouterModule.register([
      {
        path: 'management', // Nəticə URL: /management/users
        module: UserFeatureModule,
      },
    ]),
  ],
})
export class RoutingDemoModule {}

/**
 * 💡 `main.ts`-də Global Prefix və Versioning Aktivləşdirilməsi:
 * 
 * ```typescript
 * import { NestFactory } from '@nestjs/core';
 * import { VersioningType } from '@nestjs/common';
 * import { AppModule } from './app.module';

 * async function bootstrap() {
 *   const app = await NestFactory.create(AppModule);

 *   // 1️⃣ Global Prefix (Bütün endpoint-lərin önünə /api əlavə edir):
 *   app.setGlobalPrefix('api', { exclude: ['health', 'docs'] });

 *   // 2️⃣ URI Versioning (/api/v1/users, /api/v2/users):
 *   app.enableVersioning({
 *     type: VersioningType.URI,
 *     defaultVersion: '1',
 *   });

 *   await app.listen(3000);
 * }
 * bootstrap();
 * ```
 */
