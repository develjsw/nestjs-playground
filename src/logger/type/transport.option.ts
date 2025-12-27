import { LogLevel } from './logger.option';

export interface TransportOptions {
  console?: ConsoleTransportOptions;
  file?: FileTransportOptions;
}

export interface ConsoleTransportOptions {
  /**
   * 콘솔 출력 최소 레벨
   * - 미설정 시 LoggerOptions.level 사용
   */
  level?: LogLevel;
}

export interface FileTransportOptions {
  filename: string;
  dirname?: string;
  maxFiles?: number;
  maxsize?: number;
  /**
   * 파일 출력 최소 레벨
   * - 미설정 시 LoggerOptions.level 사용
   */
  level?: LogLevel;
}
