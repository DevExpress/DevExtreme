import type { TranslateResult } from '@ts/core/ai/commands/translate';
import type { PromptData, PromptManager, PromptTemplateName } from '@ts/core/ai/core/prompt_manager';
import type { RequestCallbacks, RequestManager } from '@ts/core/ai/core/request_manager';

export type BaseResult = TranslateResult;

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
  protected abstract buildPromptData(params: unknown): PromptData;
  protected abstract parseResult(response: string): BaseResult;
}
