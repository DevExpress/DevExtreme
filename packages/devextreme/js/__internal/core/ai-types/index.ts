// Should this type be here?
export type TranslateResult = string;
//
// Should this type be here?
export type BaseResult = TranslateResult;
//
// Should this type be here?
export interface TranslateCommandParams {
  text: string;
  lang: string;
}
//
// Should this type be here?
export interface RequestCallbacks {
  onChunk?: (chunk: string) => void;
  onComplete?: (finalResponse: BaseResult) => void;
  onError?: (error: Error) => void;
}
//
// Should this type be here?
export interface Prompt {
  system?: string;
  user?: string;
}
//
// Should this type be here?
export interface RequestParams {
  prompt: Prompt;
  onChunk: (chunk: string) => void;
}
//
// Should this type be here?
export interface ResponseParams {
  promise: Promise<void>;
  abort: () => void;
}
//

export interface AIProvider {
  sendRequest: (params: RequestParams) => ResponseParams;
}

export interface AI {
  translate: (params: TranslateCommandParams, callbacks: RequestCallbacks) => string;
}
