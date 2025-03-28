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
  promise: Promise<string>;
  abort: () => void;
}

/**
 * @namespace DevExpress.ai
 */
export interface TranslateCommandParams {
  text: string;
  lang: string;
}

/**
 * @namespace DevExpress.ai
 */
export type TranslateResult = string;

/**
 * @namespace DevExpress.ai
 */
export type BaseResult = TranslateResult;

/**
 * @namespace DevExpress.ai
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
 * @namespace DevExpress.ai
 */
export interface AI {
  translate: (params: TranslateCommandParams, callbacks: RequestCallbacks) => () => void;
}
