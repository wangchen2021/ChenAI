import { Module } from '@nestjs/common';
import { OpenAiService } from './open-ai.service';
import { OpenAiController } from './open-ai.controller';

@Module({
  controllers: [OpenAiController],
  providers: [OpenAiService],
  exports:[OpenAiService] //共享模块
})
export class OpenAiModule {}
