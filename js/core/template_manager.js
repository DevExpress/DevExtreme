import $ from './renderer';
import { isDefined, isFunction, isRenderer } from './utils/type';
import { findBestMatches, noop } from './utils/common';
import { extend } from './utils/extend';
import { Error, log } from './errors';
import { getElementOptions, normalizeTemplateElement } from './utils/dom';
import devices from './devices';
import { Template } from './templates/template';
import { TemplateBase } from './templates/template_base';
import { FunctionTemplate } from './templates/function_template';
import { EmptyTemplate } from './templates/empty_template';
import { ChildDefaultTemplate } from './templates/child_default_template';
import { camelize } from './utils/inflector';

const TEXT_NODE = 3;
const ANONYMOUS_TEMPLATE_NAME = 'template';
const TEMPLATE_SELECTOR = '[data-options*="dxTemplate"]';
const TEMPLATE_WRAPPER_CLASS = 'dx-template-wrapper';
const DEPRECATED_WIDGET_NAMES = ['button', 'tabs', 'dropDownMenu'];
const DX_POLYMORPH_WIDGET_TEMPLATE = new FunctionTemplate(({ model, parent }) => {
    let widgetName = model.widget;
    if(!widgetName) return $();

    const widgetElement = $('<div>');
    const widgetOptions = model.options || {};

    if(DEPRECATED_WIDGET_NAMES.some(deprecatedWidgetName => deprecatedWidgetName === widgetName)) {
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
    constructor(option) {
        this._tempTemplates = [];
        this._defaultTemplates = {};
        this._anonymousTemplateName = ANONYMOUS_TEMPLATE_NAME;

        this.option = option;
    }

    static getDefaultOptions() {
        return {
            integrationOptions: {
                watchMethod: (fn, callback, options = {}) => {
                    if(!options.skipImmediate) {
                        callback(fn());
                    }
                    return noop;
                },
                templates: { 'dx-polymorph-widget': DX_POLYMORPH_WIDGET_TEMPLATE },
                createTemplate: element => new Template(element),
            }
        };
    }

    static _findTemplateByDevice(templates) {
        const suitableTemplate = findBestMatches(
            devices.current(),
            templates,
            template => getElementOptions(template).dxTemplate
        )[0];

        templates.forEach((template) => {
            if(template !== suitableTemplate) {
                $(template).remove();
            }
        });

        return suitableTemplate;
    }

    static _addOneRenderedCall(template) {
        const render = template.render.bind(template);
        return extend({}, template, {
            render(options) {
                const templateResult = render(options);
                options && options.onRendered && options.onRendered();
                return templateResult;
            }
        });
    }

    static _getNormalizedTemplateArgs(options) {
        const args = [];

        if('model' in options) {
            args.push(options.model);
        }
        if('index' in options) {
            args.push(options.index);
        }
        args.push(options.container);

        return args;
    }

    static validateTemplateSource(templateSource) {
        return typeof templateSource === 'string'
            ? normalizeTemplateElement(templateSource)
            : templateSource;
    }

    set anonymousTemplateName(templateName) {
        this._anonymousTemplateName = templateName;
    }

    get anonymousTemplateName() {
        return this._anonymousTemplateName;
    }

    addDefaultTemplate(template) {
        this._defaultTemplates = extend({}, this._defaultTemplates, template);
    }

    dispose() {
        this._tempTemplates.forEach(tempTemplate => {
            tempTemplate.template.dispose && tempTemplate.template.dispose();
        });
        this._tempTemplates = [];
    }

    initTemplates(getElementContent) {
        const templates = this._extractTemplates(getElementContent);
        const anonymousTemplateMeta = this._extractAnonymousTemplate(getElementContent);
        return { templates, anonymousTemplateMeta };
    }

    _extractTemplates(getElementContent) {
        const templateElements = getElementContent().filter(TEMPLATE_SELECTOR);
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
            const deviceTemplate = TemplateManager._findTemplateByDevice(templatesMap[templateName]);
            if(deviceTemplate) {
                // this.saveTemplate(templateName, deviceTemplate);
                templates.push({ name: templateName, template: deviceTemplate });
            }
        }
        return templates;
    }

    // saveTemplate(name, template) {
    //     const templates = this.option('integrationOptions.templates');
    //     templates[name] = this._createTemplate(template);
    // }

    _extractAnonymousTemplate(getElementContent) {
        // const templates = this.option('integrationOptions.templates');
        const $anonymousTemplate = getElementContent().detach();

        const $notJunkTemplateContent = $anonymousTemplate.filter((_, element) => {
            const isTextNode = element.nodeType === TEXT_NODE;
            const isEmptyText = $(element).text().trim().length < 1;

            return !(isTextNode && isEmptyText);
        });
        const onlyJunkTemplateContent = $notJunkTemplateContent.length < 1;

        // if(!templates[this._anonymousTemplateName] && !onlyJunkTemplateContent) {
        //     templates[this._anonymousTemplateName] = this._createTemplate($anonymousTemplate);
        // }
        return !onlyJunkTemplateContent
            ? { template: $anonymousTemplate, name: this._anonymousTemplateName }
            : {};
    }

    _createTemplateIfNeeded(templateSource) {
        const templateKey = tSource => (isRenderer(tSource) && tSource[0]) || tSource;

        const cachedTemplate = this._tempTemplates.filter((tempTemplate) => {
            templateSource = templateKey(templateSource);
            return tempTemplate.source === templateSource;
        })[0];
        if(cachedTemplate) return cachedTemplate.template;

        const template = this._createTemplate(templateSource);
        this._tempTemplates.push({ template, source: templateKey(templateSource) });
        return template;
    }

    _createTemplate(templateSource) {
        templateSource = typeof templateSource === 'string' ? normalizeTemplateElement(templateSource) : templateSource;
        return this.option('integrationOptions.createTemplate')(templateSource);
    }

    getTemplate(templateSource) {
        if(isFunction(templateSource)) {
            return new FunctionTemplate((options) => {
                const templateSourceResult = templateSource.apply(this, TemplateManager._getNormalizedTemplateArgs(options));

                if(!isDefined(templateSourceResult)) {
                    return new EmptyTemplate();
                }

                let dispose = false;
                const template = this._acquireTemplate(templateSourceResult, (templateSource) => {
                    if(templateSource.nodeType || isRenderer(templateSource) && !$(templateSource).is('script')) {
                        return new FunctionTemplate(() => templateSource);
                    }
                    dispose = true;
                    return this._createTemplate(templateSource);
                });

                const result = template.render(options);
                dispose && template.dispose && template.dispose();
                return result;
            });
        }

        return this._acquireTemplate(templateSource, this._createTemplateIfNeeded.bind(this));
    }

    _acquireTemplate(templateSource, createTemplate) {
        if(templateSource == null) {
            return new EmptyTemplate();
        }

        if(templateSource instanceof ChildDefaultTemplate) {
            return this._defaultTemplates[templateSource.name];
        }

        if(templateSource instanceof TemplateBase) {
            return templateSource;
        }

        // TODO: templateSource.render is needed for angular2 integration. Try to remove it after supporting TypeScript modules.
        if(isFunction(templateSource.render) && !isRenderer(templateSource)) {
            return TemplateManager._addOneRenderedCall(templateSource);
        }

        if(templateSource.nodeType || isRenderer(templateSource)) {
            return createTemplate($(templateSource));
        }

        if(typeof templateSource === 'string') {
            const nonIntegrationTemplates = this.option('integrationOptions.skipTemplates') || [];
            let integrationTemplate = null;

            if(nonIntegrationTemplates.indexOf(templateSource) === -1) {
                integrationTemplate = this._renderIntegrationTemplate(templateSource);
            }

            return integrationTemplate
            || this._defaultTemplates[templateSource]
            || createTemplate(templateSource);
        }

        return this._acquireTemplate(templateSource.toString(), createTemplate);
    }

    _renderIntegrationTemplate(templateSource) {
        const integrationTemplate = this.option('integrationOptions.templates')[templateSource];

        if(integrationTemplate && !(integrationTemplate instanceof TemplateBase)) {
            const isAsyncTemplate = this.option('templatesRenderAsynchronously');
            if(!isAsyncTemplate) {
                return TemplateManager._addOneRenderedCall(integrationTemplate);
            }
        }

        return integrationTemplate;
    }
}
