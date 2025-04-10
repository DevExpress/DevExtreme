import type {
  AIChangeStyleOption,
  AIChangeToneOption,
  AICommandName,
  AIToolbarItem,
  AITranslateOption,
} from '@js/ui/html_editor';
import { capitalize } from '@ts/core/utils/capitalize';

type CommandOption =
  | AIChangeStyleOption
  | AIChangeToneOption
  | AITranslateOption;

export interface CommandDefinition {
  name: string;
  text: string;
  options?: (CommandOption | string)[];
}

export type CommandsMap = Record<string, CommandDefinition>;

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

export const getDefaultOptionsByCommand = (
  command: AICommandName | 'custom',
): CommandOption[] | undefined => {
  switch (command) {
    case 'changeStyle':
      return htmlEditorAIChangeStyleOptions;
    case 'changeTone':
      return htmlEditorAIChangeToneOptions;
    case 'translate':
      return htmlEditorAITranslateOptions;
    default:
      return undefined;
  }
};

function createDefinitionFromString(commandName: AICommandName): CommandDefinition {
  const text = defaultCommandNames[commandName] ?? capitalize(commandName);
  const defaultOptions = getDefaultOptionsByCommand(commandName)?.map(capitalize);

  return {
    name: commandName,
    text,
    options: defaultOptions,
  };
}

function createDefinitionFromObject(
  name: AICommandName | 'custom',
  text?: string,
  rawOptions?: string[],
): CommandDefinition {
  const capitalizedRaw = rawOptions?.map(capitalize);
  const options = capitalizedRaw ?? getDefaultOptionsByCommand(name)?.map(capitalize);

  const displayText = text ?? defaultCommandNames[name] ?? capitalize(name);

  return {
    name,
    text: displayText,
    options,
  };
}

export function buildCommandsMap(
  commands: AIToolbarItem['commands'],
): CommandsMap {
  const map: CommandsMap = {};

  commands?.forEach((command) => {
    if (typeof command === 'string') {
      map[command] = createDefinitionFromString(command);
    } else {
      const { name, text, options } = command;
      map[name] = createDefinitionFromObject(name, text, options);
    }
  });

  return map;
}
