import type {
  HtmlEditorAIChangeStyleOption,
  HtmlEditorAIChangeToneOption,
  HtmlEditorAICommandName,
  HtmlEditorAIToolbarItem,
  HtmlEditorAITranslateOption,
} from '@js/ui/html_editor';

type DefaultOptionName =
  | HtmlEditorAIChangeStyleOption
  | HtmlEditorAIChangeToneOption
  | HtmlEditorAITranslateOption;

export interface CommandDefinition {
  id: string;
  text: string;
  options?: DefaultOptionName[];
}

export type CommandsMap = Record<string, CommandDefinition>;

export const capitalize = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

const createDisplayNameMap = <T extends string>(
  items: readonly T[],
): Record<T, string> => items.reduce((acc, item) => {
    acc[item] = capitalize(item);
    return acc;
  }, {} as Record<T, string>);

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

export const htmlEditorAIChangeStyleOptions: HtmlEditorAIChangeStyleOption[] = [
  'formal', 'informal', 'technical', 'business',
  'creative', 'journalistic', 'academic', 'persuasive',
  'narrative', 'expository', 'descriptive', 'conversational',
];

export const htmlEditorAIChangeToneOptions: HtmlEditorAIChangeToneOption[] = [
  'professional', 'casual', 'straightforward', 'confident', 'friendly',
];

export const htmlEditorAITranslateOptions: HtmlEditorAITranslateOption[] = [
  'arabic', 'chinese', 'english', 'french', 'german', 'japanese', 'spanish',
];

const defaultCommandOptions: Record<
  'changeStyle' | 'changeTone' | 'translate',
  Record<DefaultOptionName, string>
> = {
  changeStyle: createDisplayNameMap(htmlEditorAIChangeStyleOptions),
  changeTone: createDisplayNameMap(htmlEditorAIChangeToneOptions),
  translate: createDisplayNameMap(htmlEditorAITranslateOptions),
};

export const getAIDefaultCommandOptionName = (
  command: HtmlEditorAICommandName,
  option: DefaultOptionName,
): string => defaultCommandOptions[command]?.[option] ?? capitalize(option);

export const getDefaultOptionsByCommand = (
  command: HtmlEditorAICommandName | 'custom',
): DefaultOptionName[] | undefined => {
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
    id: commandName,
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
    id: name,
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
