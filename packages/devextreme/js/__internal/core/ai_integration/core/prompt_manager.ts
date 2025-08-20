import type { Prompt } from '@js/common/ai-integration';
import { templates } from '@ts/core/ai_integration/templates';

export interface PromptData {
  system?: Record<string, string>;
  user?: Record<string, string>;
}

export interface PromptTemplate {
  system?: string;
  user?: string;
}

export type PromptTemplateName =
  | 'changeStyle'
  | 'changeTone'
  | 'execute'
  | 'expand'
  | 'proofread'
  | 'shorten'
  | 'summarize'
  | 'translate'
  | 'smartPaste';

export type PromptTemplates = Map<PromptTemplateName, PromptTemplate>;

export type PromptPlaceholders = Record<string, string>;

export const ERROR_MESSAGES = {
  TEMPLATE_NOT_FOUND: 'Template not found',
};

export class PromptManager {
  private readonly templates: PromptTemplates;

  constructor() {
    this.templates = new Map(Object.entries(templates) as [PromptTemplateName, PromptTemplate][]);
  }

  public buildPrompt(templateName: PromptTemplateName, data: PromptData): Prompt {
    const template = this.templates.get(templateName);

    if (!template) {
      throw new Error(ERROR_MESSAGES.TEMPLATE_NOT_FOUND);
    }

    const system = this.generateMessage(template.system, data.system);
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
