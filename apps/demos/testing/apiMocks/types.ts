export interface MockRequest {
  url: string;
  method: string;
  body?: string | Buffer;
  headers?: Record<string, string>;
}

export interface MockHandler {
  matches: (req: MockRequest) => boolean;
  respond: (req: MockRequest) => unknown;
}
