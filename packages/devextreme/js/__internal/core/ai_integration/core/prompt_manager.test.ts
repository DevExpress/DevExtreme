import {
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type { BuildPromptOptions, PromptData, PromptTemplateName } from '@ts/core/ai_integration/core/prompt_manager';
import { ERROR_MESSAGES, LANG_TEMPLATE_NAME, PromptManager } from '@ts/core/ai_integration/core/prompt_manager';
import { metaTemplates, templates } from '@ts/core/ai_integration/templates/index';

jest.mock('@ts/core/ai_integration/templates/index', () => ({
  metaTemplates: {
    addLanguage: {
      system: '{{message}} Provide an answer in {{lang}} language.',
    },
  },
  templates: {
    'full-template': {
      system: 'System message with {{placeholder}}',
      user: 'User message with {{placeholder}}',
    },
    'system-only': {
      system: 'System message only. Placeholder is {{placeholder}}',
    },
    'user-only': {
      user: 'User message only. Placeholder is {{placeholder}}',
    },
    empty: {},
  },
}));

describe('PromptManager', () => {
  const promptManager = new PromptManager();
  const DEFAULT_OPTIONS: BuildPromptOptions = { applyMetaTemplates: true };

  describe('constructor', () => {
    it('should initialize Map with templates from templates', () => {
      // @ts-expect-error Access to protected property for a test
      const { templates: templatesMap } = promptManager;

      expect(templatesMap).toBeInstanceOf(Map);

      templatesMap.forEach((value, key) => {
        expect(value).toBe(templates[key]);
      });
    });

    it('should initialize Map with metaTemplates', () => {
      // @ts-expect-error Access to protected property for a test
      const { metaTemplates: metaTemplatesMap } = promptManager;

      expect(metaTemplatesMap).toBeInstanceOf(Map);

      metaTemplatesMap.forEach((value, key) => {
        expect(value).toBe(metaTemplates[key]);
      });
    });
  });

  describe('buildPrompt', () => {
    describe('if no template is found', () => {
      it('should throw an error', () => {
        expect(() => {
          promptManager.buildPrompt('unknown-template' as PromptTemplateName, {}, DEFAULT_OPTIONS);
        }).toThrow(ERROR_MESSAGES.TEMPLATE_NOT_FOUND);
      });
    });

    describe('full-template', () => {
      describe('if placeholders are passed', () => {
        it('should replace all placeholders in system and user', () => {
          const data: PromptData = {
            system: { placeholder: 'system-value' },
            user: { placeholder: 'user-value' },
          };

          const prompt = promptManager.buildPrompt('full-template' as PromptTemplateName, data, DEFAULT_OPTIONS);

          expect(prompt.system).toBe('System message with system-value');
          expect(prompt.user).toBe('User message with user-value');
        });
      });

      describe('part of placeholders are not passed', () => {
        it('should remain {{...}} in the string', () => {
          const data: PromptData = {
            system: { placeholder: 'system-value' },
          };

          const prompt = promptManager.buildPrompt('full-template' as PromptTemplateName, data, DEFAULT_OPTIONS);

          expect(prompt.system).toBe('System message with system-value');
          expect(prompt.user).toBe('User message with {{placeholder}}');
        });
      });

      describe('if system placeholder is not passed', () => {
        it('the original system string with placeholders should be returned', () => {
          const prompt = promptManager.buildPrompt('full-template' as PromptTemplateName, {}, DEFAULT_OPTIONS);

          expect(prompt.system).toBe('System message with {{placeholder}}');
          expect(prompt.user).toBe('User message with {{placeholder}}');
        });
      });
    });

    describe('system-only', () => {
      describe('if only system placeholder is passed', () => {
        it('should substitute placeholders into system', () => {
          const data: PromptData = {
            system: { placeholder: 'some-value' },
          };

          const prompt = promptManager.buildPrompt('system-only' as PromptTemplateName, data, DEFAULT_OPTIONS);

          expect(prompt.system).toBe('System message only. Placeholder is some-value');
          expect(prompt.user).toBeUndefined();
        });
      });

      describe('if system placeholder is not passed', () => {
        it('should return the string from the template as is', () => {
          const prompt = promptManager.buildPrompt('system-only' as PromptTemplateName, {}, DEFAULT_OPTIONS);

          expect(prompt.system).toBe('System message only. Placeholder is {{placeholder}}');
          expect(prompt.user).toBeUndefined();
        });
      });

      describe('if user placeholders are passed', () => {
        describe('there is no user template', () => {
          it('user should be assembled from values', () => {
            const data: PromptData = {
              user: { text: 'text' },
            };

            const prompt = promptManager.buildPrompt('system-only' as PromptTemplateName, data, DEFAULT_OPTIONS);

            expect(prompt.system).toBe('System message only. Placeholder is {{placeholder}}');
            expect(prompt.user).toBe('text');
          });
        });
      });
    });

    describe('user-only', () => {
      describe('if only user placeholder is passed', () => {
        it('should substitute placeholders into user', () => {
          const data: PromptData = {
            user: { placeholder: 'text' },
          };

          const prompt = promptManager.buildPrompt('user-only' as PromptTemplateName, data, DEFAULT_OPTIONS);

          expect(prompt.user).toBe('User message only. Placeholder is text');
          expect(prompt.system).toBeUndefined();
        });
      });

      describe('if user placeholder is not passed', () => {
        it('the user string with placeholders should be returned', () => {
          const prompt = promptManager.buildPrompt('user-only' as PromptTemplateName, {}, DEFAULT_OPTIONS);

          expect(prompt.user).toBe('User message only. Placeholder is {{placeholder}}');
          expect(prompt.system).toBeUndefined();
        });
      });

      describe('if system placeholder is passed', () => {
        describe('there is no system template', () => {
          it('system should be assembled from values', () => {
            const data: PromptData = {
              system: { text: '123' },
            };

            const prompt = promptManager.buildPrompt('user-only' as PromptTemplateName, data, DEFAULT_OPTIONS);

            expect(prompt.user).toBe('User message only. Placeholder is {{placeholder}}');
            expect(prompt.system).toBe('123');
          });
        });
      });
    });

    describe('empty', () => {
      describe('if something is passed to system/user', () => {
        it('should build a string', () => {
          const prompt = promptManager.buildPrompt('empty' as PromptTemplateName, {
            system: { text: 'A', lang: 'B' },
            user: { text: 'C', lang: 'D' },
          }, DEFAULT_OPTIONS);

          expect(prompt.system).toBe('A B');
          expect(prompt.user).toBe('C D');
        });
      });

      describe('if neither system nor user passed', () => {
        it('should be undefined in both of them', () => {
          const prompt = promptManager.buildPrompt('empty' as PromptTemplateName, {}, DEFAULT_OPTIONS);

          expect(prompt.system).toBeUndefined();
          expect(prompt.user).toBeUndefined();
        });
      });
    });
  });

  describe('lang', () => {
    const LANG = 'de-DE';
    const promptManagerWithLang = new PromptManager({ lang: LANG });

    describe('constructor', () => {
      it('should store lang from options', () => {
        // @ts-expect-error Access to protected property for a test
        expect(promptManagerWithLang.lang).toBe(LANG);
      });

      it('should be undefined when lang is not provided', () => {
        // @ts-expect-error Access to protected property for a test
        expect(promptManager.lang).toBeUndefined();
      });
    });

    describe('buildPrompt', () => {
      it('should wrap system message with lang template when lang is set', () => {
        const data: PromptData = {
          system: { placeholder: 'system-value' },
          user: { placeholder: 'user-value' },
        };

        const prompt = promptManagerWithLang.buildPrompt('full-template' as PromptTemplateName, data, DEFAULT_OPTIONS);

        expect(prompt.system).toBe('System message with system-value Provide an answer in de-DE language.');
        expect(prompt.user).toBe('User message with user-value');
      });

      it('should wrap system with empty message when template has no system', () => {
        const prompt = promptManagerWithLang.buildPrompt('empty' as PromptTemplateName, {}, DEFAULT_OPTIONS);

        expect(prompt.system).toBe(' Provide an answer in de-DE language.');
      });

      it('should not modify user message when lang is set', () => {
        const data: PromptData = {
          user: { placeholder: 'user-value' },
        };

        const prompt = promptManagerWithLang.buildPrompt('user-only' as PromptTemplateName, data, DEFAULT_OPTIONS);

        expect(prompt.user).toBe('User message only. Placeholder is user-value');
      });

      it('should not wrap system when lang is not set', () => {
        const data: PromptData = {
          system: { placeholder: 'system-value' },
        };

        const prompt = promptManager.buildPrompt('full-template' as PromptTemplateName, data, DEFAULT_OPTIONS);

        expect(prompt.system).toBe('System message with system-value');
      });

      it('should not wrap system when applyMetaTemplates is false', () => {
        const data: PromptData = {
          system: { placeholder: 'system-value' },
        };

        const prompt = promptManagerWithLang.buildPrompt(
          'full-template' as PromptTemplateName,
          data,
          { applyMetaTemplates: false },
        );

        expect(prompt.system).toBe('System message with system-value');
      });

      it('should use LANG_TEMPLATE_NAME to look up the meta template', () => {
        expect(LANG_TEMPLATE_NAME).toBe('addLanguage');

        // @ts-expect-error Access to protected property for a test
        const langTemplate = promptManagerWithLang.metaTemplates.get(LANG_TEMPLATE_NAME);

        expect(langTemplate).toBeDefined();
        expect(langTemplate?.system).toContain('{{lang}}');
      });
    });
  });
});
