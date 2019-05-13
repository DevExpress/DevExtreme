import $ from "./renderer";
import { isDefined, isFunction, isRenderer } from "./utils/type";
import { findBestMatches, noop } from "./utils/common";
import { extend } from "./utils/extend";
import { Error, log } from "./errors";
import { getElementOptions, normalizeTemplateElement } from "./utils/dom";
import devices from "./devices";
import DomComponent from "./dom_component";
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


var DX_POLYMORPH_WIDGET_TEMPLATE = new FunctionTemplate(function(options) {
    var widgetName = options.model.widget;
    if(widgetName) {
        var widgetElement = $("<div>"),
            widgetOptions = options.model.options || {};

        if(widgetName === "button" || widgetName === "tabs" || widgetName === "dropDownMenu") {
            var deprecatedName = widgetName;
            widgetName = camelize("dx-" + widgetName);
            log("W0001", "dxToolbar - 'widget' item field", deprecatedName, "16.1", "Use: '" + widgetName + "' instead");
        }

        if(options.parent) {
            options.parent._createComponent(widgetElement, widgetName, widgetOptions);
        } else {
            widgetElement[widgetName](widgetOptions);
        }

        return widgetElement;
    }

    return $();
});

const DOMComponentWithTemplate = DomComponent.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            integrationOptions: {
                watchMethod: function(fn, callback, options) {
                    options = options || {};
                    if(!options.skipImmediate) {
                        callback(fn());
                    }
                    return noop;
                },
                templates: { "dx-polymorph-widget": DX_POLYMORPH_WIDGET_TEMPLATE },
                createTemplate: function(element) {
                    return new Template(element);
                }
            }
        });
    },

    _init: function() {
        this.callBase();

        this._tempTemplates = [];
        this._defaultTemplates = {};
        this._initTemplates();
    },

    _dispose: function() {
        this._cleanTemplates();
        this.callBase();
    },

    _cleanTemplates: function() {
        this._tempTemplates.forEach(function(t) {
            t.template.dispose && t.template.dispose();
        });
        this._tempTemplates = [];
    },

    _initTemplates: function() {
        this._extractTemplates();
        this._extractAnonymousTemplate();
    },

    _extractTemplates: function() {
        var templateElements = this.$element().contents().filter(TEMPLATE_SELECTOR);
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
                this._saveTemplate(templateName, deviceTemplate);
            }
        }
    },

    _saveTemplate: function(name, template) {
        var templates = this.option("integrationOptions.templates");
        templates[name] = this._createTemplate(template);
    },

    _findTemplateByDevice: function(templates) {
        var suitableTemplate = findBestMatches(devices.current(), templates, function(template) {
            return getElementOptions(template).dxTemplate;
        })[0];

        templates.forEach((template) => {
            if(template !== suitableTemplate) {
                $(template).remove();
            }
        });

        return suitableTemplate;
    },

    _extractAnonymousTemplate: function() {
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
            templates[anonymousTemplateName] = this._createTemplate($anonymousTemplate);
        }
    },

    _getAnonymousTemplateName: function() {
        return ANONYMOUS_TEMPLATE_NAME;
    },

    _createTemplateIfNeeded: function(templateSource) {
        var templateKey = function(templateSource) {
            return (isRenderer(templateSource) && templateSource[0]) || templateSource;
        };

        var cachedTemplate = this._tempTemplates.filter(function(t) {
            templateSource = templateKey(templateSource);
            return t.source === templateSource;
        })[0];
        if(cachedTemplate) return cachedTemplate.template;

        var template = this._createTemplate(templateSource);
        this._tempTemplates.push({ template: template, source: templateKey(templateSource) });
        return template;
    },

    _createTemplate: function(templateSource) {
        templateSource = typeof templateSource === "string" ? normalizeTemplateElement(templateSource) : templateSource;
        return this.option("integrationOptions.createTemplate")(templateSource);
    },

    _getTemplateByOption: function(optionName) {
        return this._getTemplate(this.option(optionName));
    },

    _getTemplate: function(templateSource) {
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
                    return this._createTemplate(templateSource);
                }.bind(this));

                var result = template.render(options);
                dispose && template.dispose && template.dispose();
                return result;
            }.bind(this));
        }

        return this._acquireTemplate(templateSource, this._createTemplateIfNeeded.bind(this));
    },

    _acquireTemplate: function(templateSource, createTemplate) {
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
            var defaultTemplatesMap = this.option("defaultTemplatesMap") || {};
            var integrationTemplateName = defaultTemplatesMap[templateSource] || templateSource;

            return this._renderIntegrationTemplate(integrationTemplateName)
            || this._defaultTemplates[templateSource]
            || createTemplate(templateSource);
        }

        return this._acquireTemplate(templateSource.toString(), createTemplate);
    },

    _getNormalizedTemplateArgs: function(options) {
        var args = [];

        if("model" in options) {
            args.push(options.model);
        }
        if("index" in options) {
            args.push(options.index);
        }
        args.push(options.container);

        return args;
    },

    _addOneRenderedCall: (template) => {
        const render = template.render.bind(template);
        return extend({}, template, {
            render(options) {
                const templateResult = render(options);
                options && options.onRendered && options.onRendered();
                return templateResult;
            }
        });
    },

    _renderIntegrationTemplate: function(templateSource) {
        let integrationTemplate = this.option("integrationOptions.templates")[templateSource];

        if(integrationTemplate && !(integrationTemplate instanceof TemplateBase)) {
            const isAsyncTemplate = this.option("templatesRenderAsynchronously");
            if(!isAsyncTemplate) {
                return this._addOneRenderedCall(integrationTemplate);
            }
        }

        return integrationTemplate;
    }
});

module.exports = DOMComponentWithTemplate;
