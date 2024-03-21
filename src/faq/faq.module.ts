import { Module } from '@nestjs/common';
import { FaqService } from './faq.service';
import { FaqController } from './faq.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FAQ } from './entities/faq.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FAQ])],
  providers: [FaqService],
  controllers: [FaqController],
  exports: [FaqService],
})
export class FaqModule {}
