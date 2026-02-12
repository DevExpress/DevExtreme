import type { Prompt } from '@js/common/ai-integration';
import { metaTemplates, templates } from '@ts/core/ai_integration/templates/index';

export interface PromptData {
  system?: Record<string, string>;
  user?: Record<string, string>;
}

export interface PromptTemplate {
  system?: string;
  user?: string;
}

interface PromptManagerOptions {
  lang?: string;
}

export type PromptTemplateName = | 'changeStyle'
  | 'changeTone'
  | 'execute'
  | 'expand'
  | 'proofread'
  | 'shorten'
  | 'summarize'
  | 'translate'
  | 'smartPaste'
  | 'generateGridColumn';

export type PromptTemplates = Map<PromptTemplateName, PromptTemplate>;

export type PromptPlaceholders = Record<string, string>;

export const ERROR_MESSAGES = {
  TEMPLATE_NOT_FOUND: 'Template not found',
};

export interface BuildPromptOptions {
  applyMetaTemplates: boolean;
}

export const LANG_TEMPLATE_NAME = 'addLanguage';

export class PromptManager {
  private readonly templates: PromptTemplates;

  private readonly metaTemplates: Map<string, PromptTemplate>;

  private readonly lang?: string;

  constructor(options?: PromptManagerOptions) {
    this.templates = new Map(Object.entries(templates) as [PromptTemplateName, PromptTemplate][]);
    this.metaTemplates = new Map(Object.entries(metaTemplates));
    this.lang = options?.lang;
  }

  public buildPrompt(
    templateName: PromptTemplateName,
    data: PromptData,
    options: BuildPromptOptions,
  ): Prompt {
    const template = this.templates.get(templateName);
    const langTemplate = this.metaTemplates.get(LANG_TEMPLATE_NAME);

    if (!template) {
      throw new Error(ERROR_MESSAGES.TEMPLATE_NOT_FOUND);
    }

    const baseSystem = this.generateMessage(template.system, data.system);

    const system = options.applyMetaTemplates && this.lang && langTemplate
      ? this.generateMessage(langTemplate.system, {
        message: baseSystem ?? '',
        lang: this.lang,
      })
      : baseSystem;

    const user = this.generateMessage(template.user, data.user);

    const prompt = { system, user };

    return prompt;
  }

  private generateMessage(
    promptTemplate?: string,
    placeholders?: PromptPlaceholders,
  ): string | undefined {
    if (!placeholders && !promptTemplate) {
      return undefined;
    }

    if (!promptTemplate && placeholders) {
      return Object.keys(placeholders)
        .reduce((acc, key) => `${acc} ${placeholders[key]}`, '')
        .trim();
    }

    if (!placeholders && promptTemplate) {
      return promptTemplate;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const result = this.replacePlaceholders(promptTemplate!, placeholders!);

    return result;
  }

  private replacePlaceholders(
    promptTemplate: string,
    placeholders: Record<string, string>,
  ): string {
    const result = Object.entries(placeholders).reduce(
      // @ts-expect-error 'replaceAll' does not exist on type 'string'
      (acc, [key, value]) => (acc.replaceAll(`{{${key}}}`, value) as string),
      promptTemplate,
    );

    return result;
  }
}
