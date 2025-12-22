import { DynamicModule, Module } from '@nestjs/common';

@Module({})
export class LoggerModule {
  forRoot(): DynamicModule {
    return {
      module: LoggerModule,
    };
  }
}
