import $ from './renderer';
import { isDefined, isFunction, isRenderer } from './utils/type';
import { noop } from './utils/common';
import { extend } from './utils/extend';
import { Error, log } from './errors';
import { getElementOptions } from './utils/dom';
import { FunctionTemplate } from './templates/function_template';
import { EmptyTemplate } from './templates/empty_template';
import { camelize } from './utils/inflector';
import {
    findTemplateByDevice, templateKey,
    getNormalizedTemplateArgs, validateTemplateSource,
    defaultCreateElement, acquireTemplate,
} from './utils/template_manager';

const TEXT_NODE = 3;
const ANONYMOUS_TEMPLATE_NAME = 'template';
const TEMPLATE_SELECTOR = '[data-options*="dxTemplate"]';
const TEMPLATE_WRAPPER_CLASS = 'dx-template-wrapper';
const DEPRECATED_WIDGET_NAMES = { button: true, tabs: true, dropDownMenu: true };
const DX_POLYMORPH_WIDGET_TEMPLATE = new FunctionTemplate(({ model, parent }) => {
    let widgetName = model.widget;
    if(!widgetName) return $();

    const widgetElement = $('<div>');
    const widgetOptions = model.options || {};

    if(DEPRECATED_WIDGET_NAMES[widgetName]) {
        const deprecatedName = widgetName;
        widgetName = camelize('dx-' + widgetName);
        log('W0001', 'dxToolbar - "widget" item field', deprecatedName, '16.1', 'Use: ' + widgetName + 'instead');
    }

    if(parent) {
        parent._createComponent(widgetElement, widgetName, widgetOptions);
    } else {
        widgetElement[widgetName](widgetOptions);
    }

    return widgetElement;
});

export default class TemplateManager {
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
                watchMethod: (fn, callback, options = {}) => {
                    if(!options.skipImmediate) {
                        callback(fn());
                    }
                    return noop;
                },
                templates: { 'dx-polymorph-widget': DX_POLYMORPH_WIDGET_TEMPLATE },
            }
        };
    }

    get anonymousTemplateName() {
        return this._anonymousTemplateName;
    }

    addDefaultTemplates(templates) {
        this._defaultTemplates = extend({}, this._defaultTemplates, templates);
    }

    dispose() {
        this._tempTemplates.forEach(tempTemplate => {
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
        const templateElements = $el.contents().filter(TEMPLATE_SELECTOR);
        const templatesMap = {};

        templateElements.each((_, template) => {
            const templateOptions = getElementOptions(template).dxTemplate;

            if(!templateOptions) {
                return;
            }

            if(!templateOptions.name) {
                throw Error('E0023');
            }

            $(template).addClass(TEMPLATE_WRAPPER_CLASS).detach();
            templatesMap[templateOptions.name] = templatesMap[templateOptions.name] || [];
            templatesMap[templateOptions.name].push(template);
        });

        const templates = [];
        for(let templateName in templatesMap) {
            const deviceTemplate = findTemplateByDevice(templatesMap[templateName]);
            if(deviceTemplate) {
                templates.push({
                    name: templateName,
                    template: this._createTemplate(deviceTemplate),
                });
            }
        }
        return templates;
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
        const cachedTemplate = this._tempTemplates.filter(tempTemplate =>
            tempTemplate.source === templateKey(templateSource)
        )[0];
        if(cachedTemplate) return cachedTemplate.template;

        const template = this._createTemplate(templateSource);
        this._tempTemplates.push({ template, source: templateKey(templateSource) });
        return template;
    }

    _createTemplate(templateSource) {
        return this._createElement(validateTemplateSource(templateSource));
    }

    getTemplate(templateSource, templates, { isAsyncTemplate, skipTemplates }, context) {
        if(!isFunction(templateSource)) {
            return acquireTemplate(
                templateSource, this._createTemplateIfNeeded, templates, isAsyncTemplate, skipTemplates, this._defaultTemplates
            );
        }

        return new FunctionTemplate((options) => {
            const templateSourceResult = templateSource.apply(context, getNormalizedTemplateArgs(options));

            if(!isDefined(templateSourceResult)) {
                return new EmptyTemplate();
            }

            let dispose = false;
            const template = acquireTemplate(templateSourceResult, (templateSource) => {
                if(templateSource.nodeType || isRenderer(templateSource) && !$(templateSource).is('script')) {
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
