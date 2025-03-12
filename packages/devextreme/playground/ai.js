// PromptStore.ts
export const templates = {
  translate: {
    system: 'You are a translation assistant.',
    user: 'Translate {{text}} to {{lang}} language.',
  },
}

// PromptManager.ts
export class PromptManager {
  templates;

  constructor() {
    this.templates = new Map(Object.entries(templates));
  }

  buildPrompt(templateName, data) {
    const template = this.templates.get(templateName);

    if (!template) {
      throw new Error('Template not found');
    }

    const system = data.system ? this.replacePlaceholders(template.system, data.system) : '';
    const user = data.user ? this.replacePlaceholders(template.user, data.user) : '';

    const prompt = { system, user };

    return prompt;
  }

  replacePlaceholders(prompt, placeholders) {
    let result = prompt;

    for (const [key, value] of Object.entries(placeholders)) {
      result = result.replaceAll(`{{${key}}}`, value);
    }

    return result;
  }
}

// RequestManager.ts
export class RequestManager {
  provider;

  constructor(provider) {
    this.provider = provider;
  }

  sendRequest(prompt, callbacks) {
    if (typeof this.provider.sendRequest === 'function') {
      let accumulator = '';

      const params = {
        prompt,
        onChunk: (chunk) => {
          accumulator += chunk;

          callbacks.onChunk?.(chunk);
        },
      };

      const { promise, abort } = this.provider.sendRequest(params);

      promise
        .then((response) => { callbacks.onComplete?.(accumulator || response); })
        .catch(callbacks.onError);

      return abort;
    } else {
      throw new Error('No method for queries has been implemented');
    }
  }
}

// BaseCommand.ts
export class BaseCommand {
  promptManager;
  requestManager;

  constructor(
    promptManager,
    requestManager,
  ) {
    this.promptManager = promptManager;
    this.requestManager = requestManager;
  }

  execute(params, callbacks) {
      const data = this.buildPromptData(params);
      const templateName = this.getTemplateName();
      const prompt = this.promptManager.buildPrompt(templateName, data);

      const { abort } = this.requestManager.sendRequest(prompt, {
        onChunk: callbacks.onChunk,
        onComplete: (finalResponse) => {
          const result = this.parseResult(finalResponse);

          callbacks.onComplete?.(result);
        },
        onError: callbacks.onError,
      });

      return abort;
  }

  getTemplateName() {};
  buildPromptData(params) {};
  parseResult(raw) {};
}

// TranslateCommand.ts
export class TranslateCommand extends BaseCommand {
  getTemplateName() {
    return 'translate';
  }

  buildPromptData(params) {
    return {
      user: {
        text: params.text,
        lang: params.lang,
      }
    }
  }

  parseResult(response) {
    return response;
  }
}

// AI.ts
export class AI {
  promptManager;
  requestManager;

  constructor(provider) {
    this.promptManager = new PromptManager();
    this.requestManager = new RequestManager(provider);
  }

  execute(
    Command,
    params,
    callbacks
  ) {
    const command = new Command(this.promptManager, this.requestManager);

    return command.execute(params, callbacks);
  }

  translate(params, callbacks) {
    return this.execute(TranslateCommand, params, callbacks);
  }
}