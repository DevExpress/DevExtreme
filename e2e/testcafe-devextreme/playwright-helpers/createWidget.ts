import type { Page } from '@playwright/test';

function serializeValue(value: unknown, depth = 0): string {
  if (depth > 10) return 'undefined';
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (typeof value === 'function') {
    const str = value.toString();
    if (/^[a-zA-Z_$][a-zA-Z0-9_$]*\s*\(/.test(str) && !str.startsWith('function') && !str.startsWith('(') && !str.startsWith('async')) {
      return `function ${str}`;
    }
    return str;
  }
  if (value instanceof Date) return `new Date(${value.getTime()})`;
  if (Array.isArray(value)) {
    return `[${value.map((v) => serializeValue(v, depth + 1)).join(',')}]`;
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => `${JSON.stringify(k)}:${serializeValue(v, depth + 1)}`);
    return `{${entries.join(',')}}`;
  }
  return JSON.stringify(value);
}

export async function createWidget(
  page: Page,
  widgetName: string,
  widgetOptions: Record<string, unknown> | (() => Record<string, unknown>),
  selector = '#container',
  disableFxAnimation = true,
): Promise<void> {
  const optionsStr = typeof widgetOptions === 'function'
    ? `(${widgetOptions.toString()})()`
    : serializeValue(widgetOptions);

  const script = `
    DevExpress.fx.off = ${disableFxAnimation};
    $('${selector}')['${widgetName}'](${optionsStr});
  `;
  await page.evaluate(script);
}
