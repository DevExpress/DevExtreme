import type {
  AI as IAI,
  AIProvider,
  BaseCommandResult,
  RequestCallbacks,
  TranslateCommandParams,
  TranslateCommandResult,
} from '@js/ai_integration';
import type { BaseCommand } from '@ts/core/ai/commands/base';
import { TranslateCommand } from '@ts/core/ai/commands/translate';
import { PromptManager } from '@ts/core/ai/core/prompt_manager';
import { RequestManager } from '@ts/core/ai/core/request_manager';

export const enum CommandNames {
  Translate = 'translate',
}

export const COMMANDS = {
  [CommandNames.Translate]: TranslateCommand,
} as const;

export interface CommandDefinition<TParams, TResult extends BaseCommandResult> {
  params: TParams;
  result: TResult;
  command: BaseCommand<TParams, TResult>;
}

export interface Commands {
  [CommandNames.Translate]: CommandDefinition<TranslateCommandParams, TranslateCommandResult>;
}

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
    type Command = BaseCommand<Commands[K]['params'], Commands[K]['result']>;

    let command = this.commands.get(commandName) as Command | undefined;

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
