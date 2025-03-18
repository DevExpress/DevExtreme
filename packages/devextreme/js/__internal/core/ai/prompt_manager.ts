import type { Prompt } from '../ai-types';
import { templates } from './templates';

export interface PromptData {
  system?: Record<string, string>;
  user?: Record<string, string>;
}

export interface PromptTemplate {
  system: string;
  user: string;
}

export type TemplateName = 'translate';

export class PromptManager {
  private readonly templates: Map<TemplateName, PromptTemplate>;

  constructor() {
    this.templates = new Map(Object.entries(templates) as [TemplateName, PromptTemplate][]);
  }

  public buildPrompt(templateName: TemplateName, data: PromptData): Prompt {
    const template = this.templates.get(templateName);

    if (!template) {
      throw new Error('Template not found');
    }

    const system = data.system ? this.replacePlaceholders(template.system, data.system) : undefined;
    const user = data.user ? this.replacePlaceholders(template.user, data.user) : undefined;

    const prompt = { system, user };

    return prompt;
  }

  private replacePlaceholders(prompt: string, placeholders: Record<string, string>): string {
    const result = Object.entries(placeholders).reduce(
      (acc, [key, value]) => acc.split(`{{${key}}}`).join(value),
      prompt,
    );

    return result;
  }
}
