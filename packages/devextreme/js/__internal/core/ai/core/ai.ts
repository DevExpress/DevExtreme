import type { AIProvider, RequestCallbacks } from '@js/ai/ai';
import type { BaseCommand } from '@ts/core/ai/commands/base';
import type { TranslateCommandParams } from '@ts/core/ai/commands/translate';
import { TranslateCommand } from '@ts/core/ai/commands/translate';
import { PromptManager } from '@ts/core/ai/core/prompt_manager';
import { RequestManager } from '@ts/core/ai/core/request_manager';

export class AI {
  private readonly promptManager: PromptManager;

  private readonly requestManager: RequestManager;

  constructor(provider: AIProvider) {
    this.promptManager = new PromptManager();
    this.requestManager = new RequestManager(provider);
  }

  private execute<F extends BaseCommand>(
    Command: new (
      promptManager: PromptManager,
      requestManager: RequestManager,
    ) => F,
    params: unknown,
    callbacks: RequestCallbacks,
  ): () => void {
    const command = new Command(this.promptManager, this.requestManager);

    return command.execute(params, callbacks);
  }

  public translate(params: TranslateCommandParams, callbacks: RequestCallbacks): () => void {
    return this.execute(TranslateCommand, params, callbacks);
  }
}
