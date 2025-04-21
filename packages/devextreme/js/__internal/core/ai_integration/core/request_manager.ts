import type { AIProvider, Prompt, RequestParams } from '@js/common/ai-integration';

export const ERROR_MESSAGES = {
  METHOD_NOT_IMPLEMENTED: 'No method for queries has been implemented',
};

export interface RequestManagerCallbacks {
  onChunk?: (chunk: string) => void;
  onComplete?: (response: string) => void;
  onError?: (error: Error) => void;
}

export class RequestManager {
  private readonly provider: AIProvider;

  constructor(provider: AIProvider) {
    this.provider = provider;
  }

  public sendRequest(prompt: Prompt, callbacks: RequestManagerCallbacks): () => void {
    if (typeof this.provider.sendRequest === 'function') {
      const params: RequestParams = {
        prompt,
        onChunk: (chunk: string): void => { callbacks?.onChunk?.(chunk); },
      };

      const { promise, abort } = this.provider.sendRequest(params);

      promise
        .then((response) => { callbacks?.onComplete?.(response); })
        .catch((e) => { callbacks?.onError?.(e); });

      return abort;
    }

    throw new Error(ERROR_MESSAGES.METHOD_NOT_IMPLEMENTED);
  }
}
