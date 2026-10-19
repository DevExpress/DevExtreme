import config from '@js/core/config';
import type { Device } from '@js/core/devices';
import devices from '@js/core/devices';
import { getPublicElement } from '@js/core/element';
import Errors from '@js/core/errors';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { ChildDefaultTemplate } from '@js/core/templates/child_default_template';
import { EmptyTemplate } from '@js/core/templates/empty_template';
import type { dxTemplateOptions } from '@js/core/templates/template';
import { Template } from '@js/core/templates/template';
import { TemplateBase } from '@js/core/templates/template_base';
import { groupBy } from '@js/core/utils/array';
import { extend } from '@js/core/utils/extend';
import type { TemplateElement, TemplateRenderOptions } from '@ts/core/templates/template_base';
import { findBestMatches } from '@ts/core/utils/m_common';

import domUtils from './m_dom';
import typeUtils from './m_type';

interface TemplateWithRender {
  render: (options: TemplateRenderOptions) => unknown;
}

type TemplateOptions = { [TKey in keyof Device]?: unknown } & dxTemplateOptions;

interface RawTemplate<TElement, TOptions> {
  element: TElement;
  options: TOptions;
}

const isRenderer = (
  value: unknown,
): value is dxElementWrapper & ArrayLike<Node | Window> => typeUtils.isRenderer(value);

const hasRender = (
  value: NonNullable<unknown>,
): value is TemplateWithRender => typeUtils.isFunction(
  (value as Partial<TemplateWithRender>).render,
);

const hasNodeType = (
  value: NonNullable<unknown>,
): value is Node => !!(value as Partial<Node>).nodeType;

interface FindTemplates {
  (
    element: Element | dxElementWrapper,
    name: 'dxTemplate',
  ): RawTemplate<Element, TemplateOptions>[];
  (
    element: Element | dxElementWrapper,
    name: string,
  ): RawTemplate<Element, Record<string, unknown>>[];
}

export const findTemplates: FindTemplates = (
  element: Element | dxElementWrapper,
  name: string,
) => {
  const optionsAttributeName = 'data-options';
  const templates = $(element).contents().filter(`[${optionsAttributeName}*="${name}"]`);

  return [].slice.call(templates).map((templateElement: Element) => {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const optionsString = $(templateElement).attr(optionsAttributeName) || '';
    return {
      element: templateElement,
      // @ts-expect-error optionsParser do not exist in public type
      options: config().optionsParser(optionsString)[name],
    };
  }).filter((template) => !!template.options);
};

export const suitableTemplatesByName = <TElement>(
  rawTemplates: RawTemplate<TElement, TemplateOptions>[],
): Record<string, TElement> => {
  const templatesMap = groupBy(rawTemplates, (template) => template.options.name);

  if (templatesMap.undefined) {
    throw Errors.Error('E0023');
  }

  const result: Record<string, TElement> = {};

  Object.keys(templatesMap).forEach((name) => {
    const suitableTemplate = findBestMatches(
      devices.current(),
      templatesMap[name],
      (template) => template.options,
    )[0]?.element;

    if (suitableTemplate) {
      result[name] = suitableTemplate;
    }
  });

  return result;
};

export const addOneRenderedCall = (template: TemplateWithRender): TemplateWithRender => {
  const render = template.render.bind(template);
  return extend({}, template, {
    render(options: TemplateRenderOptions): unknown {
      const templateResult = render(options);
      if (options?.onRendered) {
        options.onRendered();
      }
      return templateResult;
    },
  });
};

export const addPublicElementNormalization = (
  template: TemplateWithRender,
): TemplateWithRender => {
  const render = template.render.bind(template);
  return extend({}, template, {
    render(options: TemplateRenderOptions): unknown {
      const $container = $(options.container);
      return render({ ...options, container: getPublicElement($container) });
    },
  });
};

export const getNormalizedTemplateArgs = (options: TemplateRenderOptions): unknown[] => {
  const args: unknown[] = [];

  if ('model' in options) {
    args.push(options.model);
  }
  if ('index' in options) {
    args.push(options.index);
  }
  args.push(options.container);

  return args;
};

export const validateTemplateSource = (templateSource: unknown): unknown => (
  typeof templateSource === 'string'
    ? domUtils.normalizeTemplateElement(templateSource)
    : templateSource
);

export const templateKey = (templateSource: unknown): unknown => (
  isRenderer(templateSource) && templateSource[0]
) || templateSource;

export const defaultCreateElement = (element: TemplateElement): Template => new Template(element);

export const acquireIntegrationTemplate = (
  templateSource: string,
  templates: Record<string, unknown>,
  isAsyncTemplate?: boolean,
  skipTemplates?: string[],
): unknown => {
  let integrationTemplate: unknown = null;

  if (!skipTemplates || !skipTemplates.includes(templateSource)) {
    integrationTemplate = templates[templateSource];
    if (integrationTemplate && !(integrationTemplate instanceof TemplateBase)) {
      if (hasRender(integrationTemplate)) {
        integrationTemplate = addPublicElementNormalization(integrationTemplate);
      }

      if (!isAsyncTemplate) {
        // @ts-expect-error an integration template has render
        integrationTemplate = addOneRenderedCall(integrationTemplate);
      }
    }
  }

  return integrationTemplate;
};

export const acquireTemplate = (
  templateSource: unknown,
  createTemplate: (source: unknown) => unknown,
  templates: Record<string, unknown>,
  isAsyncTemplate: boolean | undefined,
  skipTemplates: string[] | undefined,
  defaultTemplates: Record<string, unknown>,
): unknown => {
  if (templateSource == null) {
    return new EmptyTemplate();
  }

  if (templateSource instanceof ChildDefaultTemplate) {
    return defaultTemplates[templateSource.name];
  }

  if (templateSource instanceof TemplateBase) {
    return templateSource;
  }

  // TODO: templateSource.render is needed for angular2 integration.
  // Try to remove it after supporting TypeScript modules.
  if (hasRender(templateSource) && !isRenderer(templateSource)) {
    return isAsyncTemplate ? templateSource : addOneRenderedCall(templateSource);
  }

  if (hasNodeType(templateSource) || isRenderer(templateSource)) {
    return createTemplate($(templateSource));
  }

  // @ts-expect-error the remaining sources are used as template names
  const templateName: string = templateSource;

  return acquireIntegrationTemplate(templateName, templates, isAsyncTemplate, skipTemplates)
      || defaultTemplates[templateName]
      || createTemplate(templateName);
};

export default {
  findTemplates,
  suitableTemplatesByName,
  addOneRenderedCall,
  addPublicElementNormalization,
  getNormalizedTemplateArgs,
  validateTemplateSource,
  templateKey,
  defaultCreateElement,
  acquireIntegrationTemplate,
  acquireTemplate,
};
