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
    constructor(option, element, owner, getDefaultTemplates, getAnonymousTemplateName) {
        this._tempTemplates = []; // should be defined by control
        this._defaultTemplates = getDefaultTemplates(); // should be defined by control
        this.ownerDefaultTemplates = owner._defaultTemplates;
        this.owner = owner;

        this.option = (optionName) => owner.option(optionName);
        this.$element = () => owner.$element();
        // this.__getDefaultTemplates = getDefaultTemplates;
        this.__getAnonymousTemplateName = getAnonymousTemplateName();
    }

    static getAnonymousTemplateName() { // ???
        return ANONYMOUS_TEMPLATE_NAME; // should be defined by control
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

    dispose() {
        this._tempTemplates.forEach(tempTemplate => {
            tempTemplate.template.dispose && tempTemplate.template.dispose();
        });
        this._tempTemplates = [];
    }

    initTemplates() {
        this._defaultTemplates = this.ownerDefaultTemplates || this._defaultTemplates;

        this._extractTemplates();
        this._extractAnonymousTemplate();
    }

    _extractTemplates() {
        const templateElements = this.$element().contents().filter(TEMPLATE_SELECTOR);
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

        for(let templateName in templatesMap) {
            const deviceTemplate = TemplateManager._findTemplateByDevice(templatesMap[templateName]);
            if(deviceTemplate) {
                this.saveTemplate(templateName, deviceTemplate);
            }
        }
    }

    saveTemplate(name, template) { // we change arguments!!!
        const templates = this.option('integrationOptions.templates'); // why ???
        templates[name] = this.createTemplate(template); // why ??? we change it by reference
    }

    _extractAnonymousTemplate() {
        const templates = this.option('integrationOptions.templates'); // we change it
        const anonymousTemplateName = this.__getAnonymousTemplateName;
        const $anonymousTemplate = this.$element().contents().detach();

        const $notJunkTemplateContent = $anonymousTemplate.filter((_, element) => {
            const isTextNode = element.nodeType === TEXT_NODE;
            const isEmptyText = $(element).text().trim().length < 1;

            return !(isTextNode && isEmptyText);
        });
        const onlyJunkTemplateContent = $notJunkTemplateContent.length < 1;

        if(!templates[anonymousTemplateName] && !onlyJunkTemplateContent) {
            templates[anonymousTemplateName] = this.createTemplate($anonymousTemplate); // why ??? we change it by reference !!!!
        }
    }

    _createTemplateIfNeeded(templateSource) {
        const templateKey = tSource => (isRenderer(tSource) && tSource[0]) || tSource;

        const cachedTemplate = this._tempTemplates.filter((tempTemplate) => {
            templateSource = templateKey(templateSource);
            return tempTemplate.source === templateSource;
        })[0];
        if(cachedTemplate) return cachedTemplate.template;

        const template = this.createTemplate(templateSource);
        this._tempTemplates.push({ template, source: templateKey(templateSource) });
        return template;
    }

    createTemplate(templateSource) {
        templateSource = typeof templateSource === 'string' ? normalizeTemplateElement(templateSource) : templateSource;
        return this.option('integrationOptions.createTemplate')(templateSource);
    }

    getTemplate(templateSource) {
        this._defaultTemplates = this.ownerDefaultTemplates || this._defaultTemplates;

        if(isFunction(templateSource)) {
            return new FunctionTemplate(function(options) {
                const templateSourceResult = templateSource.apply(this, TemplateManager._getNormalizedTemplateArgs(options));

                if(!isDefined(templateSourceResult)) {
                    return new EmptyTemplate();
                }

                let dispose = false;
                const template = this._acquireTemplate(templateSourceResult, function(templateSource) {
                    if(templateSource.nodeType || isRenderer(templateSource) && !$(templateSource).is('script')) {
                        return new FunctionTemplate(function() {
                            return templateSource;
                        });
                    }
                    dispose = true;
                    return this.createTemplate(templateSource);
                }.bind(this));

                const result = template.render(options);
                dispose && template.dispose && template.dispose();
                return result;
            }.bind(this));
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
