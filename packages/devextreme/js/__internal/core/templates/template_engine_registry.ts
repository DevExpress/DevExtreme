import errors from '@js/core/errors';
import type { dxElementWrapper } from '@js/core/renderer';
import { isString } from '@js/core/utils/type';
import type { TemplateElement } from '@ts/core/templates/template_base';

export interface TemplateEngine<TCompiled = unknown> {
  compile: (element: TemplateElement) => TCompiled;
  render: (
    template: TCompiled,
    model: unknown,
    index: number | undefined,
  ) => Element | dxElementWrapper | string;
}

const templateEngines: Record<string, TemplateEngine> = {};
// eslint-disable-next-line @typescript-eslint/init-declarations
let currentTemplateEngine: TemplateEngine;

export function registerTemplateEngine<TCompiled>(
  name: string,
  templateEngine: TemplateEngine<TCompiled>,
): void {
  // @ts-expect-error TemplateEngine<TCompiled> is not assignable to TemplateEngine<unknown>
  templateEngines[name] = templateEngine;
}

export function setTemplateEngine(templateEngine: string | TemplateEngine): void {
  if (isString(templateEngine)) {
    currentTemplateEngine = templateEngines[templateEngine];
    if (!currentTemplateEngine) {
      throw errors.Error('E0020', templateEngine);
    }
  } else {
    currentTemplateEngine = templateEngine;
  }
}

export function getCurrentTemplateEngine(): TemplateEngine { return currentTemplateEngine; }
