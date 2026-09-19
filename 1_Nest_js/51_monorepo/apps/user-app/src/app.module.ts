import { Module } from '@nestjs/common';
import { ExternalModule } from '@app/external';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ExternalModule], // Shared library imported from monorepo!
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
