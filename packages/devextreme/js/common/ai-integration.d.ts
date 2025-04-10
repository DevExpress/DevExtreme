/**
 * @docid
 * @namespace DevExpress.aiIntegration
 * @public
 */
export type Prompt = {
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
};

/**
 * @docid
 * @namespace DevExpress.aiIntegration
 * @public
 */
export type RequestParams = {
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
};

/**
 * @docid
 * @namespace DevExpress.aiIntegration
 * @public
 */
export type Response = {
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
};

/**
 * @namespace DevExpress.aiIntegration
 */
export type TranslateCommandParams = {
  text: string;
  lang: string;
};

/**
 * @namespace DevExpress.aiIntegration
 */
export type TranslateCommandResult = string;

/**
 * @namespace DevExpress.aiIntegration
 */
export type BaseCommandResult = TranslateCommandResult;

/**
 * @namespace DevExpress.aiIntegration
 */
export type RequestCallbacks = {
  onChunk?: (chunk: string) => void;
  onComplete?: (finalResponse: BaseCommandResult) => void;
  onError?: (error: Error) => void;
};

/**
 * @docid
 * @namespace DevExpress.aiIntegration
 * @public
 */
export type AIProvider = {
  /**
   * @docid
   * @public
   */
  sendRequest: (params: RequestParams) => Response;
};

/**
 * @docid
 * @namespace DevExpress.aiIntegration
 * @public
 */
export class AIIntegration {
  /**
   * @docid
   * @param provider
   */
  constructor(provider: AIProvider);
  /**
   * @publicName translate(params, callbacks)
   */
  translate(params: TranslateCommandParams, callbacks: RequestCallbacks): () => void;
}
