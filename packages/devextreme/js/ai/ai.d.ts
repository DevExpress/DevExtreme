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
 * @namespace DevExpress.ai
 * @public
 */
export interface TranslateCommandParams {
  text: string;
  lang: string;
}

/**
 * @namespace DevExpress.ai
 * @public
 */
export type TranslateResult = string;

/**
 * @namespace DevExpress.ai
 * @public
 */
export type BaseResult = TranslateResult;

/**
 * @namespace DevExpress.ai
 * @public
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
 * @public
 */
export interface AI {
  translate: (params: TranslateCommandParams, callbacks: RequestCallbacks) => () => void;
}
