export interface TranslateCommandParams {
  text: string;
  lang: string;
}

export interface RequestCallbacks {
  onChunk?: (chunk: string) => void;
  onComplete?: (finalResponse: string) => void;
  onError?: (error: Error) => void;
}

export interface Prompt {
  system?: string;
  user?: string;
}

export interface RequestParams {
  prompt: Prompt;
  onChunk: (chunk: string) => void;
}

export interface ResponseParams {
  promise: Promise<void>;
  abort: () => void;
}

export interface AIProvider {
  sendRequest: (params: RequestParams) => ResponseParams;
}

export interface AI {
  translate: (params: TranslateCommandParams, callbacks: RequestCallbacks) => string;
}
