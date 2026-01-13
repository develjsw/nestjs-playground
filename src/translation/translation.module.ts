import { Module } from '@nestjs/common';
import { TranslationService } from './translation.service';
import { TranslationGateway } from './translation.gateway';

@Module({
  providers: [TranslationService, TranslationGateway],
  exports: [TranslationService],
})
export class TranslationModule {}
