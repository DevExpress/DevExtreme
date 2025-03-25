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
export interface AIProvider {
  sendRequest: (params: RequestParams) => ResponseParams;
}
