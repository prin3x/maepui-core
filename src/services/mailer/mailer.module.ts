import { Module } from '@nestjs/common';
import { MyMailerService } from './mailer.service';

@Module({
  providers: [MyMailerService],
  exports: [MyMailerService],
})
export class MyMailerModule {}
