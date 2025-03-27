/**
 * @namespace DevExpress.ai
 * @public
 */
export interface Prompt {
  system?: string;
  user?: string;
}

/**
 * @namespace DevExpress.ai
 * @public
 */
export interface RequestParams {
  prompt: Prompt;
  onChunk: (chunk: string) => void;
}

/**
 * @namespace DevExpress.ai
 * @public
 */
export interface ResponseParams {
  promise: Promise<void>;
  abort: () => void;
}

/**
 * @hidden
 */
export interface TranslateCommandParams {
  text: string;
  lang: string;
}

/**
 * @hidden
 */
export type TranslateResult = string;

/**
 * @hidden
 */
export type BaseResult = TranslateResult;

/**
 * @hidden
 */
export interface RequestCallbacks {
  onChunk?: (chunk: string) => void;
  onComplete?: (finalResponse: BaseResult) => void;
  onError?: (error: Error) => void;
}

/**
 * @namespace DevExpress.ai
 * @public
 */
export interface AIProvider {
  sendRequest: (params: RequestParams) => ResponseParams;
}

/**
 * @hidden
 */
export interface AI {
  translate: (params: TranslateCommandParams, callbacks: RequestCallbacks) => () => void;
}
