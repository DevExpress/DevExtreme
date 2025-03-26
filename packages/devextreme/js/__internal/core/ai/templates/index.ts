import type { PromptTemplate } from '@ts/core/ai/core/prompt_manager';

export type PromptTemplates = Record<string, PromptTemplate>;

export const templates: PromptTemplates = {
  translate: {
    system: 'You are a translation assistant, who speaks {{lang}} at a native level.',
    user: 'Translate "{{text}}" to {{lang}} language.',
  },
};
