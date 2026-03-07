import * as fs from 'node:fs';
import * as path from 'node:path';

import { TemplateVarValue, TemplateVars } from './types';

export interface TemplateRenderer {
  renderTemplate: (templateName: string, vars?: TemplateVars) => string;
}

function stringifyTemplateValue(value: TemplateVarValue): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  if (typeof value === 'bigint') {
    return value.toString();
  }

  return JSON.stringify(value);
}

export function createTemplateRenderer(
  templatesRoot: string,
  escapeHtml: (value: string) => string,
): TemplateRenderer {
  const templateCache = new Map<string, string>();

  function readTemplate(templateName: string): string {
    const key = String(templateName || '');

    const cached = templateCache.get(key);
    if (cached !== undefined) {
      return cached;
    }

    const filePath = path.resolve(templatesRoot, key);
    const relativePath = path.relative(templatesRoot, filePath);

    if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
      throw new Error(`Invalid template path: ${key}`);
    }

    const templateText = fs.readFileSync(filePath, 'utf8');
    templateCache.set(key, templateText);

    return templateText;
  }

  function getTemplateValue(data: TemplateVars, key: string, shouldEscape: boolean): string {
    const hasValue = Object.prototype.hasOwnProperty.call(data, key);
    const value: TemplateVarValue = hasValue ? data[key] : '';
    const valueAsString = stringifyTemplateValue(value);

    if (shouldEscape) {
      return escapeHtml(valueAsString);
    }

    return valueAsString;
  }

  function renderTemplate(templateName: string, vars: TemplateVars = {}): string {
    const template = readTemplate(templateName);
    const data = vars;

    return template
      .replace(/\{\{\{([A-Za-z0-9_]+)\}\}\}/g, (_, key: string) => getTemplateValue(data, key, false))
      .replace(/\{\{([A-Za-z0-9_]+)\}\}/g, (_, key: string) => getTemplateValue(data, key, true));
  }

  return {
    renderTemplate,
  };
}
