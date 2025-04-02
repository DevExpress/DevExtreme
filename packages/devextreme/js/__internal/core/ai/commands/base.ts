import type { BaseCommandResult, RequestCallbacks } from '@js/ai';
import type { PromptData, PromptManager, PromptTemplateName } from '@ts/core/ai/core/prompt_manager';
import type { RequestManager } from '@ts/core/ai/core/request_manager';

export abstract class BaseCommand<TParams, TResult extends BaseCommandResult> {
  constructor(
    protected promptManager: PromptManager,
    protected requestManager: RequestManager,
  ) {}

  public execute(params: TParams, callbacks: RequestCallbacks): () => void {
    const templateName = this.getTemplateName();
    const data = this.buildPromptData(params);

    const prompt = this.promptManager.buildPrompt(templateName, data);

    const abort = this.requestManager.sendRequest(prompt, {
      onChunk: (chunk) => { callbacks?.onChunk?.(chunk); },
      onComplete: (result) => {
        const finalResponse = this.parseResult(result);

        callbacks?.onComplete?.(finalResponse);
      },
      onError: (error) => { callbacks?.onError?.(error); },
    });

    return abort;
  }

  protected abstract getTemplateName(): PromptTemplateName;
  protected abstract buildPromptData(params: TParams): PromptData;
  protected abstract parseResult(response: string): TResult;
}
