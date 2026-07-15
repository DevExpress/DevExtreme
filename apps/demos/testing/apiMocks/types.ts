export interface MockHandler {
  matches: (url: string) => boolean;
  respond: (url: string) => unknown;
}
