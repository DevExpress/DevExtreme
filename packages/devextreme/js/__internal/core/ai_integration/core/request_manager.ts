import type { AIProvider, Prompt, RequestCallbacks } from '@js/common/ai-integration';

export const ERROR_MESSAGES = {
  METHOD_NOT_IMPLEMENTED: 'No method for queries has been implemented',
};

export class RequestManager {
  private readonly provider: AIProvider;

  constructor(provider: AIProvider) {
    this.provider = provider;
  }

  public sendRequest(prompt: Prompt, callbacks: RequestCallbacks): () => void {
    if (typeof this.provider.sendRequest === 'function') {
      const params = {
        prompt,
        onChunk: (chunk: string): void => { callbacks?.onChunk?.(chunk); },
      };

      const { result, abort } = this.provider.sendRequest(params);

      result
        .then((response) => { callbacks?.onComplete?.(response); })
        .catch((e) => { callbacks?.onError?.(e); });

      return abort;
    }

    throw new Error(ERROR_MESSAGES.METHOD_NOT_IMPLEMENTED);
  }
}
