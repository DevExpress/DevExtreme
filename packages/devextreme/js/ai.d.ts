/**
 * @docid
 * @namespace DevExpress.ai
 * @public
 */
export interface Prompt {
  system?: string;
  user?: string;
}

/**
 * @docid
 * @namespace DevExpress.ai
 * @public
 */
export interface RequestParams {
  prompt: Prompt;
  onChunk: (chunk: string) => void;
}

/**
 * @docid
 * @namespace DevExpress.ai
 * @public
 */
export interface ResponseParams {
  promise: Promise<string>;
  abort: () => void;
}

/**
 * @docid
 * @namespace DevExpress.ai
 * @public
 */
export interface TranslateCommandParams {
  text: string;
  lang: string;
}

/**
 * @docid
 * @namespace DevExpress.ai
 * @public
 */
export type TranslateCommandResult = string;

/**
 * @docid
 * @namespace DevExpress.ai
 * @public
 */
export type BaseCommandResult = TranslateCommandResult;

/**
 * @docid
 * @namespace DevExpress.ai
 * @public
 */
export interface RequestCallbacks {
  onChunk?: (chunk: string) => void;
  onComplete?: (finalResponse: BaseCommandResult) => void;
  onError?: (error: Error) => void;
}

/**
 * @docid
 * @namespace DevExpress.ai
 * @public
 */
export interface AIProvider {
  sendRequest: (params: RequestParams) => ResponseParams;
}

/**
 * @docid
 * @namespace DevExpress.ai
 * @public
 */
export class AI {
  /**
   * @param provider
   */
  constructor(provider: AIProvider);
  /**
   * @docid
   * @publicName translate(params, callbacks)
   * @public
   */
  translate(params: TranslateCommandParams, callbacks: RequestCallbacks): () => void;
}
