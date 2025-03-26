import {
  describe,
  expect,
  it,
} from '@jest/globals';
import type { PromptData, PromptTemplateName } from '@ts/core/ai/core/prompt_manager';
import { ERROR_MESSAGE, PromptManager } from '@ts/core/ai/core/prompt_manager';
import { templates } from '@ts/core/ai/templates/index';

describe('PromptManager', () => {
  const promptManager = new PromptManager();

  describe('constructor', () => {
    it('initializes Map with templates from templates', () => {
      // @ts-expect-error
      const { templates: templatesMap } = promptManager;

      expect(templatesMap).toBeInstanceOf(Map);

      templatesMap.forEach((value, key) => {
        expect(value).toBe(templates[key]);
      });
    });
  });

  describe('buildPrompt', () => {
    it('throws an error if no template is found', () => {
      expect(() => {
        promptManager.buildPrompt('unknown-template' as PromptTemplateName, {});
      }).toThrow(ERROR_MESSAGE.TEMPLATE_NOT_FOUND);
    });

    it('returns correct system/user without placeholders if data is empty', () => {
      const templateName = 'translate';
      const template = templates[templateName];

      const prompt = promptManager.buildPrompt(templateName, {});

      expect(prompt.system).toBe(template.system);
      expect(prompt.user).toBe(template.user);
    });

    it('substitutes values into the user placeholders, if specified', () => {
      const data: PromptData = {
        user: {
          text: 'text for translation',
          lang: 'French',
        },
      };

      const prompt = promptManager.buildPrompt('translate', data);

      expect(prompt.system).toBe('You are a translation assistant, who speaks {{lang}} at a native level.');
      expect(prompt.user).toBe(`Translate "${data.user?.text}" to ${data.user?.lang} language.`);
    });

    it('if a part of placeholders is missing, they remain in the string unchanged', () => {
      const data: PromptData = {
        user: {
          text: 'text for translation',
        },
      };

      const prompt = promptManager.buildPrompt('translate', data);

      expect(prompt.user).toBe(`Translate "${data.user?.text}" to {{lang}} language.`);
    });

    it('substitutes values into the system placeholders, if specified', () => {
      const data: PromptData = {
        system: {
          lang: 'French',
        },
      };

      const prompt = promptManager.buildPrompt('translate', data);

      expect(prompt.system).toBe(`You are a translation assistant, who speaks ${data.system?.lang} at a native level.`);
      expect(prompt.user).toBe('Translate "{{text}}" to {{lang}} language.');
    });
  });
});
