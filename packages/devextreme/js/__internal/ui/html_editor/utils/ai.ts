import type {
  ChangeStyleCommandParams,
  ChangeStyleCommandResult,
  ChangeToneCommandParams,
  ChangeToneCommandResult,
  ExecuteCommandParams,
  ExecuteCommandResult,
  ExpandCommandParams,
  ExpandCommandResult,
  ProofreadCommandParams,
  ProofreadCommandResult,
  RequestCallbacks,
  ShortenCommandParams,
  ShortenCommandResult,
  SummarizeCommandParams,
  SummarizeCommandResult,
  TranslateCommandParams,
  TranslateCommandResult,
} from '@js/common/ai-integration';
import type {
  AIChangeStyleOption,
  AIChangeToneOption,
  AICommandName,
  AICommandNameExtended,
  AICustomCommand,
  AIToolbarItem,
  AITranslateOption,
} from '@js/ui/html_editor';
import { capitalize } from '@ts/core/utils/capitalize';

export const AI_DIALOG_ASKAI_COMMAND_NAME = 'askAI';
export const AI_DIALOG_CUSTOM_COMMAND_NAME = 'custom';

type CommandOption = | AIChangeStyleOption
  | AIChangeToneOption
  | AITranslateOption;

export interface CommandDefinition {
  id: string;
  name: AICommandNameExtended;
  text: string;
  options?: (CommandOption | string)[];
  prompt?: (param?: string) => string;
}

export type CommandsMap = Record<string, CommandDefinition>;

export interface AICommandParamsMap {
  summarize: SummarizeCommandParams;
  proofread: ProofreadCommandParams;
  expand: ExpandCommandParams;
  shorten: ShortenCommandParams;
  changeStyle: ChangeStyleCommandParams;
  changeTone: ChangeToneCommandParams;
  translate: TranslateCommandParams;
  askAI: ExecuteCommandParams;
  custom: ExecuteCommandParams;
}

export interface AICommandResultMap {
  summarize: SummarizeCommandResult;
  proofread: ProofreadCommandResult;
  expand: ExpandCommandResult;
  shorten: ShortenCommandResult;
  changeStyle: ChangeStyleCommandResult;
  changeTone: ChangeToneCommandResult;
  translate: TranslateCommandResult;
  askAI: ExecuteCommandResult;
  custom: ExecuteCommandResult;
}

export type AICommandExecutor<T extends AICommandNameExtended> = (
  params: AICommandParamsMap[T],
  callbacks: RequestCallbacks<AICommandResultMap[T]>,
) => () => void;

export const defaultCommandNames: Record<AICommandName, string> = {
  summarize: 'Summarize',
  proofread: 'Proofread',
  expand: 'Expand',
  shorten: 'Shorten',
  changeStyle: 'Change Style',
  changeTone: 'Change Tone',
  translate: 'Translate',
  askAI: 'Ask AI',
};

const htmlEditorAIChangeStyleOptions: AIChangeStyleOption[] = [
  'formal', 'informal', 'technical', 'business',
  'creative', 'journalistic', 'academic', 'persuasive',
  'narrative', 'expository', 'descriptive', 'conversational',
];

const htmlEditorAIChangeToneOptions: AIChangeToneOption[] = [
  'professional', 'casual', 'straightforward', 'confident', 'friendly',
];

const htmlEditorAITranslateOptions: AITranslateOption[] = [
  'arabic', 'chinese', 'english', 'french', 'german', 'japanese', 'spanish',
];

const aiCommandNames = {
  summarize: 'summarize',
  proofread: 'proofread',
  expand: 'expand',
  shorten: 'shorten',
  changeStyle: 'changeStyle',
  changeTone: 'changeTone',
  translate: 'translate',
  askAI: 'execute',
  custom: 'execute',
} as const satisfies Record<AICommandNameExtended, string>;

export type AICommandNameEnum = typeof aiCommandNames[keyof typeof aiCommandNames];

export const getDefaultOptionsByCommand = (
  command: AICommandNameExtended,
): CommandOption[] | undefined => {
  const commandToOptionsMap: Record<string, CommandOption[]> = {
    changeStyle: htmlEditorAIChangeStyleOptions,
    changeTone: htmlEditorAIChangeToneOptions,
    translate: htmlEditorAITranslateOptions,
  };

  return commandToOptionsMap[command];
};

const createDefinitionFromString = (commandName: AICommandName): CommandDefinition => {
  const text = defaultCommandNames[commandName] ?? capitalize(commandName);
  const defaultOptions = getDefaultOptionsByCommand(commandName)?.map(capitalize);

  return {
    id: commandName,
    text,
    name: commandName,
    options: defaultOptions,
  };
};

const createDefinitionFromObject = (
  id: string,
  name: AICommandNameExtended,
  text?: string,
  rawOptions?: string[],
  prompt?: (param?: string) => string,
): CommandDefinition => {
  const capitalizedRaw = rawOptions?.map(capitalize);
  const options = capitalizedRaw ?? getDefaultOptionsByCommand(name)?.map(capitalize);
  const displayText = text ?? defaultCommandNames[name] ?? capitalize(name);

  const definition = {
    id,
    name,
    text: displayText,
    options,
    prompt,
  };

  return definition;
};

export const buildCommandsMap = (commands: AIToolbarItem['commands']): CommandsMap => {
  const map: CommandsMap = {};
  let index = 0;

  commands?.forEach((command) => {
    if (typeof command === 'string') {
      map[command] = createDefinitionFromString(command);
    } else {
      const { name, text, options } = command;
      const isCustom = name === 'custom';
      const { prompt } = command as AICustomCommand;
      const id = `${name}${isCustom ? index : ''}`;

      map[id] = createDefinitionFromObject(id, name, text, options, prompt);

      if (isCustom) {
        index += 1;
      }
    }
  });

  return map;
};

export const getAICommandName = (
  uiCommandName: AICommandNameExtended,
): AICommandNameEnum => aiCommandNames[uiCommandName];

const getUserCustomPrompt = (
  uiCommandName: AICommandNameExtended,
  askAIPrompt = '',
  option = '',
  getCustomPrompt?: (param: string) => string,
): string => {
  let customPrompt = '';

  if (uiCommandName === AI_DIALOG_ASKAI_COMMAND_NAME) {
    customPrompt = askAIPrompt ?? '';
  } else if (uiCommandName === AI_DIALOG_CUSTOM_COMMAND_NAME) {
    customPrompt = getCustomPrompt?.(option) ?? '';
  }

  return customPrompt;
};

export const buildAICommandParams = <T extends AICommandNameExtended>(
  uiCommandName: T,
  askAIPrompt?: string,
  option?: string,
  getCustomPrompt?: (param: string) => string,
  payloadText?: string,
): AICommandParamsMap[T] => {
  const text = payloadText ?? '';

  switch (uiCommandName) {
    case 'expand':
    case 'proofread':
    case 'summarize':
    case 'shorten': {
      return { text } as AICommandParamsMap[T];
    }
    case 'changeStyle': {
      const params = {
        text,
        writingStyle: option,
      };

      return params as AICommandParamsMap[T];
    }
    case 'changeTone': {
      const params = {
        text,
        tone: option,
      };

      return params as AICommandParamsMap[T];
    }
    case 'translate': {
      const params = {
        text,
        lang: option,
      };

      return params as AICommandParamsMap[T];
    }
    case 'askAI':
    case 'custom':
    default: {
      const userPrompt = getUserCustomPrompt(
        uiCommandName,
        askAIPrompt,
        option,
        getCustomPrompt,
      );

      const params = {
        text: `Text: "${text}". ${userPrompt}`.trim(),
      };

      return params as AICommandParamsMap[T];
    }
  }
};

export const hasInvalidCustomCommand = (commandsMap: CommandsMap): boolean => Object.keys(commandsMap).some((command) => command.startsWith('custom') && !commandsMap[command].prompt);
