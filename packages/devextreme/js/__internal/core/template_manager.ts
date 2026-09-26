import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { noop } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import {
  acquireTemplate,
  defaultCreateElement,
  findTemplates,
  getNormalizedTemplateArgs,
  suitableTemplatesByName,
  templateKey,
  validateTemplateSource,
} from '@js/core/utils/template_manager';
import { isDefined, isFunction, isRenderer } from '@js/core/utils/type';
import { EmptyTemplate } from '@ts/core/templates/empty_template';
import { FunctionTemplate } from '@ts/core/templates/function_template';

const TEXT_NODE = 3;
const ANONYMOUS_TEMPLATE_NAME = 'template';
const TEMPLATE_OPTIONS_NAME = 'dxTemplate';
const TEMPLATE_WRAPPER_CLASS = 'dx-template-wrapper';

interface TemplateLike {
  render: (options: unknown) => unknown;
  dispose?: () => void;
}

export type CreateElement = (templateSource: unknown) => TemplateLike;

type ElementFilter = (predicate: (index: number, element: Node) => boolean) => dxElementWrapper;

interface TempTemplate {
  template: TemplateLike;
  source: unknown;
}

interface RawTemplate {
  element: Element;
  options: { name: string };
}

export interface NamedTemplate {
  name: string;
  template: TemplateLike;
}

export interface AnonymousTemplateMeta {
  template?: TemplateLike;
  name?: string;
}

export interface GetTemplateOptions {
  isAsyncTemplate?: boolean;
  skipTemplates?: string[];
}

interface WatchOptions {
  skipImmediate?: boolean;
}

interface PolymorphWidgetModel {
  widget?: string;
  options?: Record<string, unknown>;
}

interface PolymorphWidgetParent {
  _createComponent: (
    element: dxElementWrapper,
    name: string,
    options: Record<string, unknown>,
  ) => unknown;
}

const DX_POLYMORPH_WIDGET_TEMPLATE = new FunctionTemplate((
  { model, parent }: { model: PolymorphWidgetModel; parent?: PolymorphWidgetParent },
) => {
  const widgetName = model.widget;
  if (!widgetName) return $();

  const widgetElement = $('<div>');
  const widgetOptions = model.options ?? {};

  if (parent) {
    parent._createComponent(widgetElement, widgetName, widgetOptions);
  } else {
    const widgetFactories = widgetElement as unknown as
      Record<string, (options: unknown) => unknown>;
    widgetFactories[widgetName](widgetOptions);
  }

  return widgetElement;
});

export class TemplateManager {
  _tempTemplates: TempTemplate[];

  _defaultTemplates: Record<string, TemplateLike | string>;

  _anonymousTemplateName: string;

  _createElement: CreateElement;

  constructor(createElement?: CreateElement, anonymousTemplateName?: string) {
    this._tempTemplates = [];
    this._defaultTemplates = {};
    this._anonymousTemplateName = anonymousTemplateName || ANONYMOUS_TEMPLATE_NAME;

    this._createElement = createElement ?? (defaultCreateElement as CreateElement);
    this._createTemplateIfNeeded = this._createTemplateIfNeeded.bind(this);
  }

  static createDefaultOptions(): {
    integrationOptions: {
      watchMethod: (
        fn: () => unknown,
        callback: (value: unknown) => void,
        options?: WatchOptions,
      ) => () => void;
      templates: Record<string, TemplateLike>;
      useDeferUpdateForTemplates: boolean;
    };
  } {
    return {
      integrationOptions: {
        watchMethod: (fn, callback, options: WatchOptions = {}): () => void => {
          if (!options.skipImmediate) {
            callback(fn());
          }
          return noop;
        },
        templates: { 'dx-polymorph-widget': DX_POLYMORPH_WIDGET_TEMPLATE },
        useDeferUpdateForTemplates: true,
      },
    };
  }

  get anonymousTemplateName(): string {
    return this._anonymousTemplateName;
  }

  addDefaultTemplates(templates: Record<string, TemplateLike | string>): void {
    this._defaultTemplates = extend({}, this._defaultTemplates, templates);
  }

  dispose(): void {
    this._tempTemplates.forEach((tempTemplate) => {
      if (tempTemplate.template.dispose) {
        tempTemplate.template.dispose();
      }
    });
    this._tempTemplates = [];
  }

  extractTemplates($el: dxElementWrapper): {
    templates: NamedTemplate[];
    anonymousTemplateMeta: AnonymousTemplateMeta;
  } {
    const templates = this._extractTemplates($el);
    const anonymousTemplateMeta = this._extractAnonymousTemplate($el);
    return { templates, anonymousTemplateMeta };
  }

  _extractTemplates($el: dxElementWrapper): NamedTemplate[] {
    const templates: RawTemplate[] = findTemplates($el, TEMPLATE_OPTIONS_NAME);
    const suitableTemplates: Record<string, Element> = suitableTemplatesByName(templates);

    templates.forEach(({ element, options: { name } }) => {
      if (element === suitableTemplates[name]) {
        $(element).addClass(TEMPLATE_WRAPPER_CLASS).detach();
      } else {
        $(element).remove();
      }
    });

    return Object.keys(suitableTemplates).map((name) => ({
      name,
      template: this._createTemplate(suitableTemplates[name]),
    }));
  }

  _extractAnonymousTemplate($el: dxElementWrapper): AnonymousTemplateMeta {
    const $anonymousTemplate = $el.contents().detach();

    const filterContents = $anonymousTemplate.filter as unknown as ElementFilter;
    const $notJunkTemplateContent = filterContents.call($anonymousTemplate, (_, element) => {
      const isTextNode = element.nodeType === TEXT_NODE;
      const isEmptyText = $(element).text().trim().length < 1;

      return !(isTextNode && isEmptyText);
    });

    return $notJunkTemplateContent.length > 0
      ? { template: this._createTemplate($anonymousTemplate), name: this._anonymousTemplateName }
      : {};
  }

  _createTemplateIfNeeded(templateSource: unknown): TemplateLike {
    const cachedTemplate = this._tempTemplates
      .filter((tempTemplate) => tempTemplate.source === templateKey(templateSource))[0];
    if (cachedTemplate) return cachedTemplate.template;

    const template = this._createTemplate(templateSource);
    this._tempTemplates.push({ template, source: templateKey(templateSource) });
    return template;
  }

  _createTemplate(templateSource: unknown): TemplateLike {
    return this._createElement(validateTemplateSource(templateSource));
  }

  getTemplate(
    templateSource: unknown,
    templates: Record<string, unknown>,
    { isAsyncTemplate, skipTemplates }: GetTemplateOptions,
    context?: unknown,
  ): TemplateLike | string {
    if (!isFunction(templateSource)) {
      return acquireTemplate(
        templateSource,
        this._createTemplateIfNeeded,
        templates,
        isAsyncTemplate,
        skipTemplates,
        this._defaultTemplates,
      ) as TemplateLike | string;
    }
    return new FunctionTemplate((options) => {
      const templateSourceResult = templateSource.apply(
        context,
        getNormalizedTemplateArgs(options),
      );

      if (!isDefined(templateSourceResult)) {
        return new EmptyTemplate();
      }

      let dispose = false;
      const template = acquireTemplate(templateSourceResult, (source: unknown) => {
        if ((source as Node).nodeType || (isRenderer(source) && !$(source as Element).is('script'))) {
          return new FunctionTemplate(() => source);
        }
        dispose = true;
        return this._createTemplate(source);
      }, templates, isAsyncTemplate, skipTemplates, this._defaultTemplates) as TemplateLike;

      const result = template.render(options);
      if (dispose && template.dispose) {
        template.dispose();
      }
      return result;
    });
  }
}

export default { TemplateManager };
