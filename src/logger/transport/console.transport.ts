import * as winston from 'winston';
import { ConsoleTransportOptions } from 'winston/lib/winston/transports';
import {
  commonFormatter,
  printFormatter,
} from '../formatter/winston.formatter';

type ConsoleTransportOptionsType = Pick<
  ConsoleTransportOptions,
  'level' /*| 'format'*/
>;

export class ConsoleTransport {
  build(options: ConsoleTransportOptionsType = {}): winston.transport {
    const { level } = options;

    return new winston.transports.Console({
      level,
      format: printFormatter(commonFormatter()),
    });
  }
}
