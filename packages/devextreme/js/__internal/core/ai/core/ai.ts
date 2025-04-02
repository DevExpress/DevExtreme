import type {
  AI as IAI,
  AIProvider,
  BaseCommandResult,
  RequestCallbacks,
  TranslateCommandParams,
  TranslateCommandResult,
} from '@js/ai';
import type { BaseCommand } from '@ts/core/ai/commands/base';
import { TranslateCommand } from '@ts/core/ai/commands/translate';
import { PromptManager } from '@ts/core/ai/core/prompt_manager';
import { RequestManager } from '@ts/core/ai/core/request_manager';

export class AI implements IAI {
  private readonly promptManager: PromptManager;

  private readonly requestManager: RequestManager;

  constructor(provider: AIProvider) {
    this.promptManager = new PromptManager();
    this.requestManager = new RequestManager(provider);
  }

  private execute<
    TParams,
    TResult extends BaseCommandResult,
    F extends BaseCommand<TParams, TResult>,
  >(
    Command: new (
      promptManager: PromptManager,
      requestManager: RequestManager,
    ) => F,
    params: TParams,
    callbacks: RequestCallbacks,
  ): () => void {
    const command = new Command(this.promptManager, this.requestManager);

    return command.execute(params, callbacks);
  }

  public translate(params: TranslateCommandParams, callbacks: RequestCallbacks): () => void {
    return this.execute<TranslateCommandParams, TranslateCommandResult, TranslateCommand>(
      TranslateCommand,
      params,
      callbacks,
    );
  }
}
