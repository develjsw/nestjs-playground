import { Injectable, Logger } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { TranslateRequestDto, TranslateResponseDto } from './dto/translate.dto';

@Injectable()
export class TranslationService {
  private readonly logger = new Logger(TranslationService.name);
  private readonly openai: ChatOpenAI;
  private readonly promptTemplate: ChatPromptTemplate;

  constructor() {
    this.openai = new ChatOpenAI({
      model: 'gpt-4o-mini',
      temperature: 0.3,
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

  async translate(request: TranslateRequestDto): Promise<TranslateResponseDto> {
    const { text, sourceLanguage, targetLanguage } = request;
    try {
      this.logger.log(
        `Translating from ${sourceLanguage} to ${targetLanguage}`,
      );

      // LangChain 체인 구성 및 실행
      const chain = this.promptTemplate.pipe(this.openai);

      const { content } = await chain.invoke({
        sourceLanguage,
        targetLanguage,
        text,
      });

      return {
        translatedText: JSON.stringify(content),
        originalText: text,
        sourceLanguage,
        targetLanguage,
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error('Translation failed', error);
      throw error;
    }
  }
}
