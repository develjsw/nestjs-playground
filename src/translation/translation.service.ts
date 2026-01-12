import { Injectable, Logger } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { TranslateRequestDto, TranslateResponseDto } from './dto/translate.dto';

/**
 * Translation Service
 * LangChain과 OpenAI를 사용한 번역 서비스
 */
@Injectable()
export class TranslationService {
  private readonly logger = new Logger(TranslationService.name);
  private readonly openai: ChatOpenAI;
  private readonly promptTemplate: ChatPromptTemplate;

  constructor() {
    this.openai = new ChatOpenAI({
      modelName: 'gpt-4o-mini',
      temperature: 0.3, // 낮은 temperature로 일관된 번역 결과 유도
      apiKey: process.env.OPENAI_API_KEY,
    });

    // 번역 프롬프트 템플릿
    this.promptTemplate = ChatPromptTemplate.fromMessages([
      [
        'system',
        'You are a professional translator. Translate the given text accurately and naturally while preserving the original meaning and tone.',
      ],
      [
        'user',
        'Translate the following text from {sourceLanguage} to {targetLanguage}:\n\n{text}',
      ],
    ]);
  }

  /**
   * 텍스트 번역 실행
   * @param request 번역 요청 데이터
   * @returns 번역 결과
   */
  async translate(request: TranslateRequestDto): Promise<TranslateResponseDto> {
    try {
      this.logger.log(
        `Translating from ${request.sourceLanguage} to ${request.targetLanguage}`,
      );

      // LangChain 체인 구성 및 실행
      const chain = this.promptTemplate.pipe(this.openai);

      const result = await chain.invoke({
        sourceLanguage: request.sourceLanguage,
        targetLanguage: request.targetLanguage,
        text: request.text,
      });

      return {
        translatedText: result.content.toString(),
        originalText: request.text,
        sourceLanguage: request.sourceLanguage,
        targetLanguage: request.targetLanguage,
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error('Translation failed', error);
      throw error;
    }
  }
}
