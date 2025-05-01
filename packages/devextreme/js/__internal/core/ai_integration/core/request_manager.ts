import type { AIProvider, Prompt, RequestParams } from '@js/common/ai-integration';

export const ERROR_MESSAGES = {
  METHOD_NOT_IMPLEMENTED: 'No method for queries has been implemented',
};

export interface RequestManagerCallbacks {
  onChunk?: (chunk: string) => void;
  onComplete?: (response: string) => void;
  onError?: (error: Error) => void;
}

export type RequestManagerParams = RequestParams & {
  onChunk?: (chunk: string) => void;
};

export class RequestManager {
  private readonly provider: AIProvider;

  constructor(provider: AIProvider) {
    this.provider = provider;
  }

  public sendRequest(prompt: Prompt, callbacks: RequestManagerCallbacks): () => void {
    if (typeof this.provider.sendRequest === 'function') {
      let aborted = false;

      const params: RequestManagerParams = {
        prompt,
        onChunk: (chunk: string): void => { if (!aborted) { callbacks?.onChunk?.(chunk); } },
      };

      const { promise, abort: abortRequest } = this.provider.sendRequest(params);

      promise
        .then((response) => { if (!aborted) { callbacks?.onComplete?.(response); } })
        .catch((e) => { if (!aborted) { callbacks?.onError?.(e); } });

      const abort = (): void => {
        aborted = true;
        abortRequest?.();
      };

      return abort;
    }

    throw new Error(ERROR_MESSAGES.METHOD_NOT_IMPLEMENTED);
  }
}
