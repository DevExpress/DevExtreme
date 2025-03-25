import type { AIProvider, Prompt } from '@js/ai/ai';
import type { BaseResult } from '@ts/core/ai/commands/base';

export interface RequestCallbacks {
  onChunk?: (chunk: string) => void;
  onComplete?: (finalResponse: BaseResult) => void;
  onError?: (error: Error) => void;
}

export class RequestManager {
  private readonly provider: AIProvider;

  constructor(provider: AIProvider) {
    this.provider = provider;
  }

  public sendRequest(prompt: Prompt, callbacks: RequestCallbacks): () => void {
    if (typeof this.provider.sendRequest === 'function') {
      let accumulator = '';

      const params = {
        prompt,
        onChunk: (chunk: string): void => {
          accumulator += chunk;

          callbacks.onChunk?.(chunk);
        },
      };

      const { promise, abort } = this.provider.sendRequest(params);

      promise
        .then(() => { callbacks.onComplete?.(accumulator); })
        .catch((e) => { callbacks.onError?.(e); });

      return abort;
    }

    throw new Error('No method for queries has been implemented');
  }
}
