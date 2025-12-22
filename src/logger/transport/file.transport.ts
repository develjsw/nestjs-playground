import * as winston from 'winston';
import { FileTransportOptions } from 'winston/lib/winston/transports';
type FileTransportOptionsType = Pick<
  FileTransportOptions,
  'filename' | 'dirname' | 'maxFiles' | 'maxsize' | 'level' /*| 'format'*/
>;
import {
  commonFormatter,
  printFormatter,
} from '../formatter/winston.formatter';

export class FileTransport {
  build(options: FileTransportOptionsType = {}): winston.transport {
    const { filename, dirname, maxFiles, maxsize, level } = options;

    return new winston.transports.File({
      filename,
      dirname,
      maxFiles,
      maxsize,
      level,
      format: printFormatter(commonFormatter()),
    });
  }
}
