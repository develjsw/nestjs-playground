import * as winston from 'winston';

export function commonFormatter() {
  return winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  );
}

export function printFormatter(
  ...formats: winston.Logform.Format[]
): winston.Logform.Format {
  return winston.format.combine(
    ...formats,
    winston.format.printf((info) => {
      const { timestamp, message, level, ...metadata } = info;

      return `[${String(timestamp)}] [${level}] ${String(message)} - ${JSON.stringify(metadata)}`;
    }),
  );
}
