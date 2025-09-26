import type { RequestCallbacks } from '@js/common/ai-integration';
import type { PromptData, PromptManager, PromptTemplateName } from '@ts/core/ai_integration/core/prompt_manager';
import type { RequestManager, RequestManagerCallbacks } from '@ts/core/ai_integration/core/request_manager';

export abstract class BaseCommand<TParams, TResult> {
  constructor(
    protected promptManager: PromptManager,
    protected requestManager: RequestManager,
  ) {}

  public execute(params: TParams, callbacks: RequestCallbacks<TResult>): () => void {
    const templateName = this.getTemplateName();
    const data = this.buildPromptData(params);

    const prompt = this.promptManager.buildPrompt(templateName, data);

    const requestManagerCallbacks: RequestManagerCallbacks = {
      onChunk: (chunk) => { callbacks?.onChunk?.(chunk); },
      onComplete: (result) => {
        const finalResponse = this.parseResult(result, params);

        callbacks?.onComplete?.(finalResponse);
      },
      onError: (error) => { callbacks?.onError?.(error); },
    };

    const abort = this.requestManager.sendRequest(prompt, requestManagerCallbacks);

    return abort;
  }

  protected abstract getTemplateName(): PromptTemplateName;
  protected abstract buildPromptData(params: TParams): PromptData;
  protected abstract parseResult(response: string, params?: TParams): TResult;
}
