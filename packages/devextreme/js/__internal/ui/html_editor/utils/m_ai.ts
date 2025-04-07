import type {
  HtmlEditorAIChangeStyleOption,
  HtmlEditorAIChangeToneOption,
  HtmlEditorAICommandName,
  HtmlEditorAIToolbarItem,
  HtmlEditorAITranslateOption,
} from '@js/ui/html_editor';

type CommandOption =
  | HtmlEditorAIChangeStyleOption
  | HtmlEditorAIChangeToneOption
  | HtmlEditorAITranslateOption;

export interface CommandDefinition {
  name: string;
  text: string;
  options?: CommandOption[];
}

export type CommandsMap = Record<string, CommandDefinition>;

export const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

export const defaultCommandNames: Record<HtmlEditorAICommandName, string> = {
  summarize: 'Summarize',
  proofread: 'Proofread',
  expand: 'Expand',
  shorten: 'Shorten',
  changeStyle: 'Change Style',
  changeTone: 'Change Tone',
  translate: 'Translate',
  askAI: 'Ask AI',
};

const htmlEditorAIChangeStyleOptions: HtmlEditorAIChangeStyleOption[] = [
  'formal', 'informal', 'technical', 'business',
  'creative', 'journalistic', 'academic', 'persuasive',
  'narrative', 'expository', 'descriptive', 'conversational',
];

const htmlEditorAIChangeToneOptions: HtmlEditorAIChangeToneOption[] = [
  'professional', 'casual', 'straightforward', 'confident', 'friendly',
];

const htmlEditorAITranslateOptions: HtmlEditorAITranslateOption[] = [
  'arabic', 'chinese', 'english', 'french', 'german', 'japanese', 'spanish',
];

export const getDefaultOptionsByCommand = (
  command: HtmlEditorAICommandName | 'custom',
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

function createDefinitionFromString(commandName: HtmlEditorAICommandName): CommandDefinition {
  const text = defaultCommandNames[commandName] ?? capitalize(commandName);
  const defaultOptions = getDefaultOptionsByCommand(commandName)?.map(capitalize);

  return {
    name: commandName,
    text,
    options: defaultOptions,
  };
}

function createDefinitionFromObject(
  name: HtmlEditorAICommandName | 'custom',
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
  commands: HtmlEditorAIToolbarItem['commands'],
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
