import type { AIProvider, RequestCallbacks } from '../ai-types';
import type { BaseCommand } from './base_command';
import { PromptManager } from './prompt_manager';
import { RequestManager } from './request_manager';

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
}
