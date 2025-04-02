import type {
  AI as IAI,
  AIProvider,
  RequestCallbacks,
  TranslateCommandParams,
  TranslateCommandResult,
} from '@js/ai';
import { TranslateCommand } from '@ts/core/ai/commands/translate';
import { PromptManager } from '@ts/core/ai/core/prompt_manager';
import { RequestManager } from '@ts/core/ai/core/request_manager';

export const enum CommandNames {
  Translate = 'translate',
}

export interface Commands {
  [CommandNames.Translate]: {
    params: TranslateCommandParams;
    result: TranslateCommandResult;
    command: TranslateCommand;
  };
}

export const COMMANDS: {
  [K in CommandNames]: new (
    promptManager: PromptManager,
    requestManager: RequestManager
  ) => Commands[K]['command'];
} = {
  [CommandNames.Translate]: TranslateCommand,
};

export class AI implements IAI {
  private readonly promptManager: PromptManager;

  private readonly requestManager: RequestManager;

  private readonly commands: Map<CommandNames, Commands[CommandNames]['command']>;

  constructor(provider: AIProvider) {
    this.promptManager = new PromptManager();
    this.requestManager = new RequestManager(provider);
    this.commands = new Map();
  }

  private execute<K extends CommandNames>(
    commandName: K,
    params: Commands[K]['params'],
    callbacks: RequestCallbacks,
  ): () => void {
    let command = this.commands.get(commandName) as Commands[K]['command'] | undefined;

    if (!command) {
      const Command = COMMANDS[commandName];

      command = new Command(this.promptManager, this.requestManager);

      this.commands.set(commandName, command);
    }

    return command.execute(params, callbacks);
  }

  public translate(params: TranslateCommandParams, callbacks: RequestCallbacks): () => void {
    return this.execute(
      CommandNames.Translate,
      params,
      callbacks,
    );
  }
}
