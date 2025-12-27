import * as winston from 'winston';
import {
  commonFormatter,
  printFormatter,
} from '../formatter/winston.formatter';
import { FileTransportOptions } from '../type/transport.option';

export class FileTransport {
  build(options: FileTransportOptions): winston.transport {
    const { filename, dirname, maxFiles, maxsize, level } = options;

    return new winston.transports.File({
      filename,
      ...(dirname && { dirname }),
      ...(maxFiles && { maxFiles }),
      ...(maxsize && { maxsize }),
      ...(level && { level }),
      format: printFormatter(commonFormatter()),
    });
  }
}
