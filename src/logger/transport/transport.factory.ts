import * as winston from 'winston';
import { ConsoleTransport } from './console.transport';
import { FileTransport } from './file.transport';
import { TransportOptions } from '../type/transport.option';

export class TransportFactory {
  private readonly consoleTransport = new ConsoleTransport();
  private readonly fileTransport = new FileTransport();

  createTransports(
    options: Pick<TransportOptions, 'console' | 'file'>,
  ): winston.transport[] {
    const transports: winston.transport[] = [];

    if (options.console) {
      transports.push(this.consoleTransport.build(options.console));
    }

    if (options.file) {
      transports.push(this.fileTransport.build(options.file));
    }

    if (!transports.length) {
      throw new Error(
        'At least one transport (console or file) must be configured',
      );
    }

    return transports;
  }
}
