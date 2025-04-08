/**
 * @docid
 * @namespace DevExpress.aIIntegration
 * @public
 */
export interface Prompt {
  /**
   * @docid
   * @public
   */
  system?: string;
  /**
   * @docid
   * @public
   */
  user?: string;
}

/**
 * @docid
 * @namespace DevExpress.aIIntegration
 * @public
 */
export interface RequestParams {
  /**
   * @docid
   * @public
   */
  prompt: Prompt;
  /**
   * @docid
   * @public
   */
  onChunk: (chunk: string) => void;
}

/**
 * @docid
 * @namespace DevExpress.aIIntegration
 * @public
 */
export interface ResponseParams {
  /**
   * @docid
   * @public
   */
  promise: Promise<string>;
  /**
   * @docid
   * @public
   */
  abort: () => void;
}

/**
 * @docid
 * @namespace DevExpress.aIIntegration
 * @public
 */
export interface TranslateCommandParams {
  /**
   * @docid
   * @public
   */
  text: string;
  /**
   * @docid
   * @public
   */
  lang: string;
}

/**
 * @docid
 * @namespace DevExpress.aIIntegration
 * @public
 */
export type TranslateCommandResult = string;

/**
 * @docid
 * @namespace DevExpress.aIIntegration
 * @public
 */
export type BaseCommandResult = TranslateCommandResult;

/**
 * @docid
 * @namespace DevExpress.aIIntegration
 * @public
 */
export interface RequestCallbacks {
  /**
   * @docid
   * @public
   */
  onChunk?: (chunk: string) => void;
  /**
   * @docid
   * @public
   */
  onComplete?: (finalResponse: BaseCommandResult) => void;
  /**
   * @docid
   * @public
   */
  onError?: (error: Error) => void;
}

/**
 * @docid
 * @namespace DevExpress.aIIntegration
 * @public
 */
export interface AIProvider {
  /**
   * @docid
   * @public
   */
  sendRequest: (params: RequestParams) => ResponseParams;
}

/**
 * @docid
 * @namespace DevExpress.aIIntegration
 * @public
 */
export class AIIntegration {
  /**
   * @docid
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
