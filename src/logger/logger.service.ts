import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';
import { TransportFactory } from './transport/transport.factory';
import { LoggerOptions } from './type/logger.option';

type PrimitiveType = string | number | boolean | object;

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;
  private transportFactory = new TransportFactory();

  constructor(options: LoggerOptions = {}) {
    const transports = this.transportFactory.createTransports(
      options.transports || { console: { level: 'info' } },
    );

    this.logger = winston.createLogger({
      level: options.level || 'info',
      format: winston.format.json(),
      defaultMeta: options.defaultMeta || {},
      transports,
    });
  }

  log(message: string, ...optionalParams: PrimitiveType[]): void {
    this.logger.info(message, ...optionalParams);
  }

  error(message: string, ...optionalParams: PrimitiveType[]): void {
    this.logger.error(message, ...optionalParams);
  }

  warn(message: string, ...optionalParams: PrimitiveType[]): void {
    this.logger.warn(message, ...optionalParams);
  }

  debug(message: string, ...optionalParams: PrimitiveType[]): void {
    this.logger.debug(message, ...optionalParams);
  }
}
