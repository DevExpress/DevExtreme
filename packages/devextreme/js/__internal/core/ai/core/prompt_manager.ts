import type { Prompt } from '@js/ai';
import { templates } from '@ts/core/ai/templates/index';

export interface PromptData {
  system?: Record<string, string>;
  user?: Record<string, string>;
}

export interface PromptTemplate {
  system: string;
  user: string;
}

export type PromptTemplateName = 'translate';

export type PromptTemplates = Map<PromptTemplateName, PromptTemplate>;

export const ERROR_MESSAGE = {
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
      throw new Error(ERROR_MESSAGE.TEMPLATE_NOT_FOUND);
    }

    const system = this.replacePlaceholders(template.system, data.system);
    const user = this.replacePlaceholders(template.user, data.user);

    const prompt = { system, user };

    return prompt;
  }

  private replacePlaceholders(prompt: string, placeholders?: Record<string, string>): string {
    if (!placeholders) {
      return prompt;
    }

    const result = Object.entries(placeholders).reduce(
      (acc, [key, value]) => acc.split(`{{${key}}}`).join(value),
      prompt,
    );

    return result;
  }
}
