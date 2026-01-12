/** 번역 요청 데이터 구조 */
export class TranslateRequestDto {
  /** 원본 텍스트 */
  text: string;
  /** 원본 언어 (예: 'ko', 'en', 'ja') */
  sourceLanguage: string;
  /** 목표 언어 */
  targetLanguage: string;
}

/** 번역 응답 데이터 구조 */
export class TranslateResponseDto {
  /** 번역된 텍스트 */
  translatedText: string;
  /** 원본 텍스트 */
  originalText: string;
  /** 원본 언어 */
  sourceLanguage: string;
  /** 목표 언어 */
  targetLanguage: string;
  /** 번역 완료 시간 */
  timestamp: Date;
}
