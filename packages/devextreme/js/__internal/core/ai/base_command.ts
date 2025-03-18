import type { RequestCallbacks } from '../ai-types';
import type { PromptData, PromptManager, TemplateName } from './prompt_manager';
import type { RequestManager } from './request_manager';

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
      onComplete: (finalResponse) => {
        const result = this.parseResult(finalResponse);

        callbacks.onComplete?.(result);
      },
      onError: callbacks.onError,
    });

    return abort;
  }

  protected abstract getTemplateName(): TemplateName;
  protected abstract buildPromptData(params: unknown): PromptData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected abstract parseResult(raw: string): any;
}
