export class TranslateRequestDto {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export class TranslateResponseDto {
  translatedText: string;
  originalText: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: Date;
}
