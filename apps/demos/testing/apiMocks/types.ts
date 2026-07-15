export interface MockRequest {
  url: string;
  method: string;
  body: Buffer;
}

export interface MockHandler {
  matches: (req: MockRequest) => boolean;
  respond: (req: MockRequest) => unknown;
}
