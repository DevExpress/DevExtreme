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
export type ChangeStyleCommandParams = {
  text: string;
  writingStyle: string;
};

/**
 * @namespace DevExpress.aiIntegration
 */
export type ChangeToneCommandParams = {
  text: string;
  tone: string;
};

/**
 * @namespace DevExpress.aiIntegration
 */
export type ExecuteCommandParams = {
  text: string;
};

/**
 * @namespace DevExpress.aiIntegration
 */
export type ExpandCommandParams = {
  text: string;
};

/**
 * @namespace DevExpress.aiIntegration
 */
export type ProofreadCommandParams = {
  text: string;
};

/**
* @namespace DevExpress.aiIntegration
*/
export type ShortenCommandParams = {
 text: string;
};

/**
 * @namespace DevExpress.aiIntegration
 */
export type SummarizeCommandParams = {
  text: string;
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
export type ChangeStyleCommandResult = string;

/**
 * @namespace DevExpress.aiIntegration
 */
export type ChangeToneCommandResult = string;

/**
 * @namespace DevExpress.aiIntegration
 */
export type ExecuteCommandResult = string;

/**
 * @namespace DevExpress.aiIntegration
 */
export type ExpandCommandResult = string;

/**
 * @namespace DevExpress.aiIntegration
 */
export type ProofreadCommandResult = string;

/**
 * @namespace DevExpress.aiIntegration
 */
export type ShortenCommandResult = string;

/**
 * @namespace DevExpress.aiIntegration
 */
export type SummarizeCommandResult = string;

/**
 * @namespace DevExpress.aiIntegration
 */
export type TranslateCommandResult = string;

/**
 * @namespace DevExpress.aiIntegration
 */
export type BaseCommandResult =
  | ExecuteCommandResult
  | ChangeStyleCommandResult
  | ChangeToneCommandResult
  | TranslateCommandResult
  | ProofreadCommandResult
  | ShortenCommandResult
  | SummarizeCommandResult
  | ExpandCommandResult;

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
   * @publicName changeStyle(params, callbacks)
   */
  changeStyle(params: ChangeStyleCommandParams, callbacks: RequestCallbacks): () => void;
  /**
   * @publicName changeTone(params, callbacks)
   */
  changeTone(params: ChangeToneCommandParams, callbacks: RequestCallbacks): () => void;
  /**
   * @publicName execute(params, callbacks)
   */
  execute(params: ExecuteCommandParams, callbacks: RequestCallbacks): () => void;
  /**
   * @publicName expand(params, callbacks)
   */
  expand(params: ExpandCommandParams, callbacks: RequestCallbacks): () => void;
  /**
   * @publicName proofread(params, callbacks)
   */
  proofread(params: ProofreadCommandParams, callbacks: RequestCallbacks): () => void;
  /**
   * @publicName shorten(params, callbacks)
   */
  shorten(params: ShortenCommandParams, callbacks: RequestCallbacks): () => void;
  /**
   * @publicName summarize(params, callbacks)
   */
  summarize(params: SummarizeCommandParams, callbacks: RequestCallbacks): () => void;
  /**
   * @publicName translate(params, callbacks)
   */
  translate(params: TranslateCommandParams, callbacks: RequestCallbacks): () => void;
}
