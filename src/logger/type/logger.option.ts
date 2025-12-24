import { TransportOptions } from './transport.option';

export interface LoggerOptions {
  level?: string;
  defaultMeta?: Record<string, any>;
  transports?: TransportOptions;
}
