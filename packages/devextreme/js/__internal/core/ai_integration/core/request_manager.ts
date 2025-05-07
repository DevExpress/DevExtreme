import type { AIProvider, Prompt, RequestParams } from '@js/common/ai-integration';
import errors from '@js/core/errors';

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
    this.validateProvider();
  }

  private validateProvider(): void {
    if (typeof this.provider.sendRequest !== 'function') {
      throw errors.Error('E0122');
    }
  }

  public sendRequest(prompt: Prompt, callbacks: RequestManagerCallbacks): () => void {
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
}
