import * as winston from 'winston';
import {
  commonFormatter,
  printFormatter,
} from '../formatter/winston.formatter';
import { ConsoleTransportOptions } from '../type/transport.option';

export class ConsoleTransport {
  build(options: ConsoleTransportOptions): winston.transport {
    const { level } = options;

    return new winston.transports.Console({
      level,
      format: printFormatter(commonFormatter()),
    });
  }
}
