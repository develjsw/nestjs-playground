import * as winston from 'winston';
import { ConsoleTransport } from './console.transport';
import { FileTransport } from './file.transport';

interface TransportOptions {
  console?: {
    level?: string;
  };
  file?: {
    filename?: string;
    dirname?: string;
    maxFiles?: number;
    maxsize?: number;
    level?: string;
  };
}

export class TransportFactory {
  private consoleTransport = new ConsoleTransport();
  private fileTransport = new FileTransport();

  createTransports(options: TransportOptions): winston.transport[] {
    const transports: winston.transport[] = [];

    if (options.console) {
      transports.push(
        this.consoleTransport.build(options.console || { level: 'info' }),
      );
    }

    if (options.file) {
      transports.push(this.fileTransport.build(options.file));
    }

    return transports;
  }
}
