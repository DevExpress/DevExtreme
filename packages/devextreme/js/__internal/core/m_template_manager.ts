import $ from '@js/core/renderer';
import { EmptyTemplate } from '@js/core/templates/empty_template';
import { FunctionTemplate } from '@js/core/templates/function_template';
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

const TEXT_NODE = 3;
const ANONYMOUS_TEMPLATE_NAME = 'template';
const TEMPLATE_OPTIONS_NAME = 'dxTemplate';
const TEMPLATE_WRAPPER_CLASS = 'dx-template-wrapper';
// @ts-expect-error need to add overloaded constructor type to templates
const DX_POLYMORPH_WIDGET_TEMPLATE = new FunctionTemplate(({ model, parent }) => {
  const widgetName = model.widget;
  if (!widgetName) return $();

  const widgetElement = $('<div>');
  const widgetOptions = model.options || {};

  if (parent) {
    parent._createComponent(widgetElement, widgetName, widgetOptions);
  } else {
    widgetElement[widgetName](widgetOptions);
  }

  return widgetElement;
});

export class TemplateManager {
  _tempTemplates: any[];

  _defaultTemplates: any;

  _anonymousTemplateName: any;

  _createElement: any;

  constructor(createElement, anonymousTemplateName) {
    this._tempTemplates = [];
    this._defaultTemplates = {};
    this._anonymousTemplateName = anonymousTemplateName || ANONYMOUS_TEMPLATE_NAME;

    this._createElement = createElement || defaultCreateElement;
    this._createTemplateIfNeeded = this._createTemplateIfNeeded.bind(this);
  }

  static createDefaultOptions() {
    return {
      integrationOptions: {
        watchMethod: (fn, callback, options: any = {}) => {
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

  get anonymousTemplateName() {
    return this._anonymousTemplateName;
  }

  addDefaultTemplates(templates) {
    this._defaultTemplates = extend({}, this._defaultTemplates, templates);
  }

  dispose() {
    this._tempTemplates.forEach((tempTemplate: any) => {
      tempTemplate.template.dispose && tempTemplate.template.dispose();
    });
    this._tempTemplates = [];
  }

  extractTemplates($el) {
    const templates = this._extractTemplates($el);
    const anonymousTemplateMeta = this._extractAnonymousTemplate($el);
    return { templates, anonymousTemplateMeta };
  }

  _extractTemplates($el) {
    const templates = findTemplates($el, TEMPLATE_OPTIONS_NAME);
    const suitableTemplates = suitableTemplatesByName(templates);

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

  _extractAnonymousTemplate($el) {
    const $anonymousTemplate = $el.contents().detach();

    const $notJunkTemplateContent = $anonymousTemplate.filter((_, element) => {
      const isTextNode = element.nodeType === TEXT_NODE;
      const isEmptyText = $(element).text().trim().length < 1;

      return !(isTextNode && isEmptyText);
    });

    return $notJunkTemplateContent.length > 0
      ? { template: this._createTemplate($anonymousTemplate), name: this._anonymousTemplateName }
      : {};
  }

  _createTemplateIfNeeded(templateSource) {
    const cachedTemplate: any = this._tempTemplates.filter((tempTemplate: any) => tempTemplate.source === templateKey(templateSource))[0];
    if (cachedTemplate) return cachedTemplate.template;

    const template = this._createTemplate(templateSource);
    this._tempTemplates.push({ template, source: templateKey(templateSource) });
    return template;
  }

  _createTemplate(templateSource) {
    return this._createElement(validateTemplateSource(templateSource));
  }

  getTemplate(templateSource, templates, { isAsyncTemplate, skipTemplates }, context) {
    if (!isFunction(templateSource)) {
      return acquireTemplate(templateSource, this._createTemplateIfNeeded, templates, isAsyncTemplate, skipTemplates, this._defaultTemplates);
    }
    // @ts-expect-error need to add overloaded constructor type to templates
    return new FunctionTemplate((options) => {
      const templateSourceResult = templateSource.apply(context, getNormalizedTemplateArgs(options));

      if (!isDefined(templateSourceResult)) {
        return new EmptyTemplate();
      }

      let dispose = false;
      const template = acquireTemplate(templateSourceResult, (templateSource) => {
        if (templateSource.nodeType || isRenderer(templateSource) && !$(templateSource).is('script')) {
          // @ts-expect-error need to add overloaded constructor type to templates
          return new FunctionTemplate(() => templateSource);
        }
        dispose = true;
        return this._createTemplate(templateSource);
      }, templates, isAsyncTemplate, skipTemplates, this._defaultTemplates);

      const result = template.render(options);
      dispose && template.dispose && template.dispose();
      return result;
    });
  }
}

export default { TemplateManager };
