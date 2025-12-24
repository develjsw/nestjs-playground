export interface TransportOptions {
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
