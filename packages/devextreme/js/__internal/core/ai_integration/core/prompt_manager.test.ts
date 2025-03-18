import {
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type { PromptData, PromptTemplateName } from '@ts/core/ai_integration/core/prompt_manager';
import { ERROR_MESSAGES, PromptManager } from '@ts/core/ai_integration/core/prompt_manager';
import { templates } from '@ts/core/ai_integration/templates/index';

jest.mock('@ts/core/ai_integration/templates/index', () => ({
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

  describe('constructor', () => {
    it('initializes Map with templates from templates', () => {
      // @ts-expect-error Access to protected property for a test
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
      }).toThrow(ERROR_MESSAGES.TEMPLATE_NOT_FOUND);
    });

    describe('full-template', () => {
      it('replaces all placeholders in system and user, if passed', () => {
        const data: PromptData = {
          system: { placeholder: 'system-value' },
          user: { placeholder: 'user-value' },
        };

        const prompt = promptManager.buildPrompt('full-template' as PromptTemplateName, data);

        expect(prompt.system).toBe('System message with system-value');
        expect(prompt.user).toBe('User message with user-value');
      });
    });

    it('part of placeholders are not passed => they remain {{...}} in the string', () => {
      const data: PromptData = {
        system: { placeholder: 'system-value' },
      };

      const prompt = promptManager.buildPrompt('full-template' as PromptTemplateName, data);

      expect(prompt.system).toBe('System message with system-value');
      expect(prompt.user).toBe('User message with {{placeholder}}');
    });

    it('if system is not set, the original system string with placeholders is returned', () => {
      const prompt = promptManager.buildPrompt('full-template' as PromptTemplateName, {});

      expect(prompt.system).toBe('System message with {{placeholder}}');
      expect(prompt.user).toBe('User message with {{placeholder}}');
    });

    describe('system-only', () => {
      it('substitutes placeholders into system, if passed', () => {
        const data: PromptData = {
          system: { placeholder: 'some-value' },
        };

        const prompt = promptManager.buildPrompt('system-only' as PromptTemplateName, data);

        expect(prompt.system).toBe('System message only. Placeholder is some-value');
        expect(prompt.user).toBeUndefined();
      });

      it('if system is not set, returns the string from the template as is', () => {
        const prompt = promptManager.buildPrompt('system-only' as PromptTemplateName, {});

        expect(prompt.system).toBe('System message only. Placeholder is {{placeholder}}');
        expect(prompt.user).toBeUndefined();
      });

      it('if user placeholders are set and there is no user template, user will be assembled from values', () => {
        const data: PromptData = {
          user: { text: 'text' },
        };

        const prompt = promptManager.buildPrompt('system-only' as PromptTemplateName, data);

        expect(prompt.system).toBe('System message only. Placeholder is {{placeholder}}');
        expect(prompt.user).toBe('text');
      });
    });

    describe('user-only', () => {
      it('substitutes placeholders into user, if passed', () => {
        const data: PromptData = {
          user: { placeholder: 'text' },
        };

        const prompt = promptManager.buildPrompt('user-only' as PromptTemplateName, data);

        expect(prompt.user).toBe('User message only. Placeholder is text');
        expect(prompt.system).toBeUndefined();
      });

      it('if user is not specified, the user string with placeholders is returned', () => {
        const prompt = promptManager.buildPrompt('user-only' as PromptTemplateName, {});

        expect(prompt.user).toBe('User message only. Placeholder is {{placeholder}}');
        expect(prompt.system).toBeUndefined();
      });

      it('if system placeholders are set and there is no system template, system will be assembled from values', () => {
        const data: PromptData = {
          system: { text: '123' },
        };

        const prompt = promptManager.buildPrompt('user-only' as PromptTemplateName, data);

        expect(prompt.user).toBe('User message only. Placeholder is {{placeholder}}');
        expect(prompt.system).toBe('123');
      });
    });

    describe('empty', () => {
      it('if something is passed to system/user, build a string, otherwise undefined', () => {
        const prompt = promptManager.buildPrompt('empty' as PromptTemplateName, {
          system: { text: 'A', lang: 'B' },
          user: { text: 'C', lang: 'D' },
        });

        expect(prompt.system).toBe('A B');
        expect(prompt.user).toBe('C D');
      });

      it('if neither system nor user passed, it will be undefined in both of them', () => {
        const prompt = promptManager.buildPrompt('empty' as PromptTemplateName, {});

        expect(prompt.system).toBeUndefined();
        expect(prompt.user).toBeUndefined();
      });
    });
  });
});
