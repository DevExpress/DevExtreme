import errors from '@js/core/errors';
import { isString } from '@js/core/utils/type';

const templateEngines = {};
let currentTemplateEngine;

export function registerTemplateEngine(name, templateEngine) {
  templateEngines[name] = templateEngine;
}

export function setTemplateEngine(templateEngine) {
  if (isString(templateEngine)) {
    currentTemplateEngine = templateEngines[templateEngine];
    if (!currentTemplateEngine) {
      throw errors.Error('E0020', templateEngine);
    }
  } else {
    currentTemplateEngine = templateEngine;
  }
}

export function getCurrentTemplateEngine() { return currentTemplateEngine; }
