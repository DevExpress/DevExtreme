import type { AIProvider, Prompt, RequestCallbacks } from '@ts/core/ai-types';

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
