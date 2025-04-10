import type { AIProvider, RequestParams, Response } from '@js/common/ai-integration';

export class Provider implements AIProvider {
  sendRequest(params: RequestParams): Response {
    const { onChunk } = params;

    const promise = new Promise<string>((resolve) => {
      onChunk('AI');
      onChunk(' response');

      resolve('AI response');
    });

    const abort = (): void => {};

    return { promise, abort };
  }
}
