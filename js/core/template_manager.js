import $ from "./renderer";
import { isDefined, isFunction, isRenderer } from "./utils/type";
import { findBestMatches, noop } from "./utils/common";
import { extend } from "./utils/extend";
import { Error, log } from "./errors";
import { getElementOptions, normalizeTemplateElement } from "./utils/dom";
import devices from "./devices";
import { Template } from "./templates/template";
import { TemplateBase } from "./templates/template_base";
import { FunctionTemplate } from "./templates/function_template";
import { EmptyTemplate } from "./templates/empty_template";
import { ChildDefaultTemplate } from "./templates/child_default_template";
import { camelize } from "./utils/inflector";

const TEXT_NODE = 3;
const ANONYMOUS_TEMPLATE_NAME = "template";
const TEMPLATE_SELECTOR = "[data-options*='dxTemplate']";
const TEMPLATE_WRAPPER_CLASS = "dx-template-wrapper";
const DEPRECATED_WIDGET_NAMES = ['button', 'tabs', 'dropDownMenu'];
const DX_POLYMORPH_WIDGET_TEMPLATE = new FunctionTemplate(({ model, parent }) => {
    let widgetName = model.widget;
    if(!widgetName) return $();

    const widgetElement = $("<div>");
    const widgetOptions = model.options || {};

    if(DEPRECATED_WIDGET_NAMES.some(deprecatedWidgetName => deprecatedWidgetName === widgetName)) {
        const deprecatedName = widgetName;
        widgetName = camelize("dx-" + widgetName);
        log("W0001", "dxToolbar - 'widget' item field", deprecatedName, "16.1", "Use: '" + widgetName + "' instead");
    }

    if(parent) {
        parent._createComponent(widgetElement, widgetName, widgetOptions);
    } else {
        widgetElement[widgetName](widgetOptions);
    }

    return widgetElement;
});

export default class TemplateManager {
    constructor(option, element) {
        debugger
        this.option = option;
        this.element = element;
        this._tempTemplates = [];
        this._defaultTemplates = {};
        this.initTemplates();
    }

    getDefaultOptions() {
        return {
            integrationOptions: {
                watchMethod: (fn, callback, options = {}) => {
                    if(!options.skipImmediate) {
                        callback(fn());
                    }
                    return noop;
                },
                templates: { "dx-polymorph-widget": DX_POLYMORPH_WIDGET_TEMPLATE },
                createTemplate: element => new Template(element),
            }
        };
    }

    // init() {
    //     // this.callBase();

    //     this._tempTemplates = [];
    //     this._defaultTemplates = {};
    //     this.initTemplates();
    // }

    dispose() {
        this._cleanTemplates();
        // this.callBase();
    }

    _cleanTemplates() {
        this._tempTemplates.forEach(function(t) {
            t.template.dispose && t.template.dispose();
        });
        this._tempTemplates = [];
    }

    initTemplates() {
        this._extractTemplates();
        this._extractAnonymousTemplate();
    }

    _extractTemplates() {
        var templateElements = this.element().contents().filter(TEMPLATE_SELECTOR);
        var templatesMap = {};

        templateElements.each(function(_, template) {
            var templateOptions = getElementOptions(template).dxTemplate;

            if(!templateOptions) {
                return;
            }

            if(!templateOptions.name) {
                throw Error("E0023");
            }

            $(template).addClass(TEMPLATE_WRAPPER_CLASS).detach();
            templatesMap[templateOptions.name] = templatesMap[templateOptions.name] || [];
            templatesMap[templateOptions.name].push(template);
        });

        for(let templateName in templatesMap) {
            var deviceTemplate = this._findTemplateByDevice(templatesMap[templateName]);
            if(deviceTemplate) {
                this.saveTemplate(templateName, deviceTemplate);
            }
        }
    }

    saveTemplate(name, template) { // ???
        var templates = this.option("integrationOptions.templates");
        templates[name] = this.createTemplate(template);
    }

    _findTemplateByDevice(templates) {
        var suitableTemplate = findBestMatches(devices.current(), templates, function(template) {
            return getElementOptions(template).dxTemplate;
        })[0];

        templates.forEach((template) => {
            if(template !== suitableTemplate) {
                $(template).remove();
            }
        });

        return suitableTemplate;
    }

    _extractAnonymousTemplate() {
        var templates = this.option("integrationOptions.templates"),
            anonymousTemplateName = this._getAnonymousTemplateName(),
            $anonymousTemplate = this.$element().contents().detach();

        var $notJunkTemplateContent = $anonymousTemplate.filter(function(_, element) {
                var isTextNode = element.nodeType === TEXT_NODE,
                    isEmptyText = $(element).text().trim().length < 1;

                return !(isTextNode && isEmptyText);
            }),
            onlyJunkTemplateContent = $notJunkTemplateContent.length < 1;

        if(!templates[anonymousTemplateName] && !onlyJunkTemplateContent) {
            templates[anonymousTemplateName] = this.createTemplate($anonymousTemplate);
        }
    }

    static getAnonymousTemplateName() {
        return ANONYMOUS_TEMPLATE_NAME;
    }

    _createTemplateIfNeeded(templateSource) {
        var templateKey = function(templateSource) {
            return (isRenderer(templateSource) && templateSource[0]) || templateSource;
        };

        var cachedTemplate = this._tempTemplates.filter(function(t) {
            templateSource = templateKey(templateSource);
            return t.source === templateSource;
        })[0];
        if(cachedTemplate) return cachedTemplate.template;

        var template = this.createTemplate(templateSource);
        this._tempTemplates.push({ template: template, source: templateKey(templateSource) });
        return template;
    }

    createTemplate(templateSource) {
        templateSource = typeof templateSource === "string" ? normalizeTemplateElement(templateSource) : templateSource;
        return this.option("integrationOptions.createTemplate")(templateSource);
    }

    getTemplateByOption(optionName) {
        return this.getTemplate(this.option(optionName));
    }

    getTemplate(templateSource) {
        if(isFunction(templateSource)) {
            return new FunctionTemplate(function(options) {
                var templateSourceResult = templateSource.apply(this, this._getNormalizedTemplateArgs(options));

                if(!isDefined(templateSourceResult)) {
                    return new EmptyTemplate();
                }

                var dispose = false;
                var template = this._acquireTemplate(templateSourceResult, function(templateSource) {
                    if(templateSource.nodeType || isRenderer(templateSource) && !$(templateSource).is("script")) {
                        return new FunctionTemplate(function() {
                            return templateSource;
                        });
                    }
                    dispose = true;
                    return this.createTemplate(templateSource);
                }.bind(this));

                var result = template.render(options);
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
            return this._addOneRenderedCall(templateSource);
        }

        if(templateSource.nodeType || isRenderer(templateSource)) {
            return createTemplate($(templateSource));
        }

        if(typeof templateSource === "string") {
            var nonIntegrationTemplates = this.option("integrationOptions.skipTemplates") || [];
            var integrationTemplate = null;

            if(nonIntegrationTemplates.indexOf(templateSource) === -1) {
                integrationTemplate = this._renderIntegrationTemplate(templateSource);
            }

            return integrationTemplate
            || this._defaultTemplates[templateSource]
            || createTemplate(templateSource);
        }

        return this._acquireTemplate(templateSource.toString(), createTemplate);
    }

    _getNormalizedTemplateArgs(options) {
        var args = [];

        if("model" in options) {
            args.push(options.model);
        }
        if("index" in options) {
            args.push(options.index);
        }
        args.push(options.container);

        return args;
    }

    _addOneRenderedCall(template) {
        const render = template.render.bind(template);
        return extend({}, template, {
            render(options) {
                const templateResult = render(options);
                options && options.onRendered && options.onRendered();
                return templateResult;
            }
        });
    }

    _renderIntegrationTemplate(templateSource) {
        let integrationTemplate = this.option("integrationOptions.templates")[templateSource];

        if(integrationTemplate && !(integrationTemplate instanceof TemplateBase)) {
            const isAsyncTemplate = this.option("templatesRenderAsynchronously");
            if(!isAsyncTemplate) {
                return this._addOneRenderedCall(integrationTemplate);
            }
        }

        return integrationTemplate;
    }
}
