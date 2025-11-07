import type { WarningDefinition } from './warning-codes';

type TemplatePrimitive = string | number | boolean;
export type TemplateArgs = TemplatePrimitive[] | Record<string, TemplatePrimitive>;

function formatWarningMessage(template: string, args?: TemplateArgs): string {
  if (!args) {
    return template;
  }

  if (Array.isArray(args)) {
    return args.reduce<string>(
      (message, value, index) => replacePlaceholder(message, `{${index}}`, String(value)),
      template,
    );
  }

  return Object.entries(args).reduce<string>(
    (message, [key, value]) => replacePlaceholder(message, `{${key}}`, String(value)),
    template,
  );
}

export function logWarning(warning: WarningDefinition, args?: TemplateArgs): void {
  if (typeof console === 'undefined' || typeof console.warn !== 'function') {
    return;
  }

  const message = formatWarningMessage(warning.template, args);
  console.warn(`${warning.code} - ${message}`);
}

function replacePlaceholder(message: string, placeholder: string, value: string): string {
  return message.split(placeholder).join(value);
}
