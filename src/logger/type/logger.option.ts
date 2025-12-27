import { TransportOptions } from './transport.option';

/**
 * Winston 로그 레벨
 * - 사용하는 레벨만 발췌하여 내부에서 사용
 * - 우선순위 : ERROR > WARN > INFO > DEBUG
 */
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

export interface LoggerOptions {
  /**
   * 기본 로그 레벨 (모든 transport에 적용)
   * - Transport별 level 미설정 시 이 값 사용
   * @default LogLevel.DEBUG
   */
  level?: LogLevel;
  /**
   * 모든 로그에 추가될 메타데이터
   * @example { service: 'api', env: 'production' }
   */
  defaultMeta?: Record<string, any>;
  transports: TransportOptions;
}
