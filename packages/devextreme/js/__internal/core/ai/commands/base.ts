import type { PromptData, PromptManager, PromptTemplateName } from '@ts/core/ai/core/prompt_manager';
import type { RequestManager } from '@ts/core/ai/core/request_manager';
import type { BaseResult, RequestCallbacks } from '@ts/core/ai-types';

export abstract class BaseCommand {
  constructor(
    protected promptManager: PromptManager,
    protected requestManager: RequestManager,
  ) {}

  public execute(params: unknown, callbacks: RequestCallbacks): () => void {
    const templateName = this.getTemplateName();
    const data = this.buildPromptData(params);

    const prompt = this.promptManager.buildPrompt(templateName, data);

    const abort = this.requestManager.sendRequest(prompt, {
      onChunk: callbacks.onChunk,
      onComplete: (result) => {
        const finalResponse = this.parseResult(result);

        callbacks.onComplete?.(finalResponse);
      },
      onError: callbacks.onError,
    });

    return abort;
  }

  protected abstract getTemplateName(): PromptTemplateName;
  protected abstract buildPromptData(params: unknown): PromptData;
  protected abstract parseResult(response: string): BaseResult;
}
