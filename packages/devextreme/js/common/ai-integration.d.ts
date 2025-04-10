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
  result: Promise<string>;
  /**
   * @docid
   * @public
   */
  abort: () => void;
};

/**
 * @docid
 * @namespace DevExpress.aiIntegration
 * @public
 */
export type TranslateCommandParams = {
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
};

/**
 * @docid
 * @namespace DevExpress.aiIntegration
 * @public
 */
export type TranslateCommandResult = string;

/**
 * @docid
 * @namespace DevExpress.aiIntegration
 * @public
 */
export type BaseCommandResult = TranslateCommandResult;

/**
 * @docid
 * @namespace DevExpress.aiIntegration
 * @public
 */
export type RequestCallbacks = {
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
   * @docid
   * @publicName translate(params, callbacks)
   * @public
   */
  translate(params: TranslateCommandParams, callbacks: RequestCallbacks): () => void;
}
