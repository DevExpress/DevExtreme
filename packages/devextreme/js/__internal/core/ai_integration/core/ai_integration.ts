import type {
  AIIntegration as IAIIntegration,
  AIProvider,
  ChangeStyleCommandParams,
  ChangeStyleCommandResult,
  ChangeToneCommandParams,
  ChangeToneCommandResult,
  ExecuteCommandParams,
  ExecuteCommandResult,
  ExpandCommandParams,
  ExpandCommandResult,
  GenerateGridColumnCommandParams,
  GenerateGridColumnCommandResult,
  ProofreadCommandParams,
  ProofreadCommandResult,
  RequestCallbacks,
  RequestParamsData,
  ShortenCommandParams,
  ShortenCommandResult,
  SmartPasteCommandParams,
  SmartPasteCommandResult,
  SummarizeCommandParams,
  SummarizeCommandResult,
  TranslateCommandParams,
  TranslateCommandResult,
} from '@js/common/ai-integration';
import type { BaseCommand } from '@ts/core/ai_integration/commands';
import {
  ChangeStyleCommand,
  ChangeToneCommand,
  ExecuteCommand,
  ExpandCommand,
  ProofreadCommand,
  ShortenCommand,
  SmartPasteCommand,
  SummarizeCommand,
  TranslateCommand,
} from '@ts/core/ai_integration/commands/index';
import { PromptManager } from '@ts/core/ai_integration/core/prompt_manager';
import { RequestManager } from '@ts/core/ai_integration/core/request_manager';

import { GenerateGridColumnCommand } from '../commands/generateGridColumn';

export const enum CommandNames {
  ChangeStyle = 'changeStyle',
  ChangeTone = 'changeTone',
  Execute = 'execute',
  Expand = 'expand',
  Proofread = 'proofread',
  Shorten = 'shorten',
  Summarize = 'summarize',
  Translate = 'translate',
  SmartPaste = 'smartPaste',
  GenerateGridColumn = 'generateGridColumn',
}

export const COMMANDS = {
  [CommandNames.ChangeStyle]: ChangeStyleCommand,
  [CommandNames.ChangeTone]: ChangeToneCommand,
  [CommandNames.Execute]: ExecuteCommand,
  [CommandNames.Expand]: ExpandCommand,
  [CommandNames.Proofread]: ProofreadCommand,
  [CommandNames.Shorten]: ShortenCommand,
  [CommandNames.Summarize]: SummarizeCommand,
  [CommandNames.Translate]: TranslateCommand,
  [CommandNames.SmartPaste]: SmartPasteCommand,
  [CommandNames.GenerateGridColumn]: GenerateGridColumnCommand,
} as const;

export interface CommandDefinition<TParams extends RequestParamsData, TResult> {
  command: BaseCommand<TParams, TResult>;
  params: TParams;
  result: TResult;
}

export interface Commands {
  [CommandNames.ChangeStyle]: CommandDefinition<ChangeStyleCommandParams, ChangeStyleCommandResult>;
  [CommandNames.ChangeTone]: CommandDefinition<ChangeToneCommandParams, ChangeToneCommandResult>;
  [CommandNames.Execute]: CommandDefinition<ExecuteCommandParams, ExecuteCommandResult>;
  [CommandNames.Expand]: CommandDefinition<ExpandCommandParams, ExpandCommandResult>;
  [CommandNames.Proofread]: CommandDefinition<ProofreadCommandParams, ProofreadCommandResult>;
  [CommandNames.Shorten]: CommandDefinition<ShortenCommandParams, ShortenCommandResult>;
  [CommandNames.Summarize]: CommandDefinition<SummarizeCommandParams, SummarizeCommandResult>;
  [CommandNames.Translate]: CommandDefinition<TranslateCommandParams, TranslateCommandResult>;
  [CommandNames.SmartPaste]: CommandDefinition<SmartPasteCommandParams, SmartPasteCommandResult>;
  [CommandNames.GenerateGridColumn]: CommandDefinition<
    GenerateGridColumnCommandParams,
    GenerateGridColumnCommandResult
  >;
}

export class AIIntegration implements IAIIntegration {
  private readonly promptManager: PromptManager;

  private readonly requestManager: RequestManager;

  private readonly commands: Map<CommandNames, Commands[CommandNames]['command']>;

  constructor(provider: AIProvider) {
    this.promptManager = new PromptManager();
    this.requestManager = new RequestManager(provider);
    this.commands = new Map();
  }

  private executeCommand<K extends CommandNames>(
    commandName: K,
    params: Commands[K]['params'],
    callbacks: RequestCallbacks<Commands[K]['result']>,
  ): () => void {
    type Command = BaseCommand<Commands[K]['params'], Commands[K]['result']>;
    type CommandInstance = Commands[K]['command'];

    let command = this.commands.get(commandName) as CommandInstance | undefined;

    if (!command) {
      const Command = COMMANDS[commandName];

      command = new Command(this.promptManager, this.requestManager);

      this.commands.set(commandName, command);
    }

    return (command as Command).execute(params, callbacks);
  }

  public changeStyle(
    params: ChangeStyleCommandParams,
    callbacks: RequestCallbacks<ChangeStyleCommandResult>,
  ): () => void {
    return this.executeCommand(
      CommandNames.ChangeStyle,
      params,
      callbacks,
    );
  }

  public changeTone(
    params: ChangeToneCommandParams,
    callbacks: RequestCallbacks<ChangeToneCommandResult>,
  ): () => void {
    return this.executeCommand(
      CommandNames.ChangeTone,
      params,
      callbacks,
    );
  }

  public execute(
    params: ExecuteCommandParams,
    callbacks: RequestCallbacks<ExecuteCommandResult>,
  ): () => void {
    return this.executeCommand(
      CommandNames.Execute,
      params,
      callbacks,
    );
  }

  public expand(
    params: ExpandCommandParams,
    callbacks: RequestCallbacks<ExpandCommandResult>,
  ): () => void {
    return this.executeCommand(
      CommandNames.Expand,
      params,
      callbacks,
    );
  }

  public proofread(
    params: ProofreadCommandParams,
    callbacks: RequestCallbacks<ProofreadCommandResult>,
  ): () => void {
    return this.executeCommand(
      CommandNames.Proofread,
      params,
      callbacks,
    );
  }

  public shorten(
    params: ShortenCommandParams,
    callbacks: RequestCallbacks<ShortenCommandResult>,
  ): () => void {
    return this.executeCommand(
      CommandNames.Shorten,
      params,
      callbacks,
    );
  }

  public summarize(
    params: SummarizeCommandParams,
    callbacks: RequestCallbacks<SummarizeCommandResult>,
  ): () => void {
    return this.executeCommand(
      CommandNames.Summarize,
      params,
      callbacks,
    );
  }

  public translate(
    params: TranslateCommandParams,
    callbacks: RequestCallbacks<TranslateCommandResult>,
  ): () => void {
    return this.executeCommand(
      CommandNames.Translate,
      params,
      callbacks,
    );
  }

  public smartPaste(
    params: SmartPasteCommandParams,
    callbacks: RequestCallbacks<SmartPasteCommandResult>,
  ): () => void {
    return this.executeCommand(
      CommandNames.SmartPaste,
      params,
      callbacks,
    );
  }

  public generateGridColumn(
    params: GenerateGridColumnCommandParams,
    callbacks: RequestCallbacks<GenerateGridColumnCommandResult>,
  ): () => void {
    return this.executeCommand(
      CommandNames.GenerateGridColumn,
      params,
      callbacks,
    );
  }
}
