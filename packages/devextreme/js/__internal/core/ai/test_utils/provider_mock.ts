import type { AIProvider, RequestParams, ResponseParams } from '@js/ai/ai';

export class Provider implements AIProvider {
  sendRequest(params: RequestParams): ResponseParams {
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
