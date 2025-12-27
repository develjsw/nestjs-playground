import { DynamicModule, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LoggerOptions } from './type/logger.option';

@Module({})
export class LoggerModule {
  static forRoot(options: LoggerOptions): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: LoggerService,
          useFactory: () => new LoggerService(options),
        },
      ],
      exports: [LoggerService],
      global: true,
    };
  }
}
