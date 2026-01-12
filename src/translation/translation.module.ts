import { Module } from '@nestjs/common';
import { TranslationService } from './translation.service';
import { TranslationGateway } from './translation.gateway';

/**
 * Translation Module
 * 실시간 채팅 번역 기능을 제공하는 모듈
 *
 * - TranslationService : LangChain + OpenAI 번역 로직
 * - TranslationGateway : WebSocket 실시간 통신
 */
@Module({
  providers: [TranslationService, TranslationGateway],
  exports: [TranslationService],
})
export class TranslationModule {}
