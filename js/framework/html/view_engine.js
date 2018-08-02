require("../../integration/jquery");

var $ = require("jquery"),
    version = require("../../core/version"),
    window = require("../../core/utils/window").getWindow(),
    Class = require("../../core/class"),
    Callbacks = require("../../core/utils/callbacks"),
    commonUtils = require("../../core/utils/common"),
    each = require("../../core/utils/iterator").each,
    inArray = require("../../core/utils/array").inArray,
    errors = require("../errors"),
    domUtils = require("../../core/utils/dom"),
    when = require("../../core/utils/deferred").when,
    ajax = require("../../core/utils/ajax"),
    _VIEW_ROLE = "dxView",
    _LAYOUT_ROLE = "dxLayout",
    MARKUP_TEMPLATE_MARKER = "MarkupTemplate:";

require("./view_engine_components");

var ViewEngine = Class.inherit({
    ctor: function(options) {
        options = options || {};
        this.$root = options.$root;
        this.device = options.device || {};
        this.dataOptionsAttributeName = options.dataOptionsAttributeName || "data-options";
        this._templateMap = {};
        this._pendingViewContainer = null;
        this.markupLoaded = Callbacks();
        this._templateContext = options.templateContext;
        this._$skippedMarkup = $();

        if(options.templatesVersion !== undefined && options.templateCacheStorage && this._isReleaseVersion()) {
            this._templateCacheEnabled = true;
            this._templatesVersion = "v_" + options.templatesVersion;
            this._templateCacheStorage = options.templateCacheStorage;
            this._templateCacheKey = "dxTemplateCache_" + version + "_" + JSON.stringify(this.device);
        }
    },

    _isReleaseVersion: function() {
        return !/http:\/\/localhost/.test(window.location.href);
    },

    _enumerateTemplates: function(processFn) {
        var that = this;
        each(that._templateMap, function(name, templatesByRoleMap) {
            each(templatesByRoleMap, function(role, templates) {
                each(templates, function(index, template) {
                    processFn(template);
                });
            });
        });
    },

    _findComponent: function(name, role) {
        var components = (this._templateMap[name] || {})[role] || [],
            filter = this._templateContext && this._templateContext.option() || {};

        components = this._filterTemplates(filter, components);

        this._checkMatchedTemplates(components);

        return components[0];
    },

    _findTemplate: function(name, role) {
        var component = this._findComponent(name, role);

        if(!component) {
            this._clearCache();
            throw errors.Error("E3013", role, name);
        }

        var $template = component.element(),
            $result;

        if(!component._isStaticComponentsCreated) {
            domUtils.createComponents($template, ["dxContent", "dxContentPlaceholder", "dxTransition"/* , "dxCommandContainer" */]);
            component._isStaticComponentsCreated = true;
        }

        $result = $template.clone().removeClass("dx-hidden");

        return $result;
    },

    _clearCache: function() {
        if(this._templateCacheEnabled) {
            this._templateCacheStorage.removeItem(this._templateCacheKey);
        }
    },

    _loadTemplatesFromMarkupCore: function($markup) {
        var that = this;

        if($markup.find("[data-dx-role]").length) {
            throw errors.Error("E3019");
        }

        that.markupLoaded.fire({
            markup: $markup
        });

        var components = domUtils.createComponents($markup, [_VIEW_ROLE, _LAYOUT_ROLE]);

        each(components, function(index, component) {
            var $element = component.element();
            $element.addClass("dx-hidden");
            that._registerTemplateComponent(component);
            component.element().detach();
        });

        var $skipped = $markup.filter("script");
        $skipped.appendTo(that.$root);
        that._$skippedMarkup = that._$skippedMarkup.add($skipped);
    },

    _registerTemplateComponent: function(component) {
        var role = component.NAME,
            options = component.option(),
            templateName = options.name,
            componentsByRoleMap = this._templateMap[templateName] || {};

        componentsByRoleMap[role] = componentsByRoleMap[role] || [];
        componentsByRoleMap[role].push(component);
        this._templateMap[templateName] = componentsByRoleMap;
    },

    _applyPartialViews: function($render) {
        var that = this;
        domUtils.createComponents($render, ["dxViewPlaceholder"]);
        each($render.find(".dx-view-placeholder"), function() {
            var $partialPlaceholder = $(this);

            if($partialPlaceholder.children().length) return;

            var viewName = $partialPlaceholder.data("dxViewPlaceholder").option("viewName"),
                $view = that._findTemplate(viewName, _VIEW_ROLE);

            that._applyPartialViews($view);
            $partialPlaceholder.append($view);
            $view.removeClass("dx-hidden");
        });
    },

    _ajaxImpl: function() {
        return ajax.sendRequest.apply($, arguments);
    },

    _loadTemplatesFromURL: function(url) {
        var that = this,
            winPhonePrefix = this._getWinPhonePrefix(),
            deferred = $.Deferred();

        url = winPhonePrefix + url;

        this._ajaxImpl({
            url: url,
            dataType: "html"
        }).done(function(data) {
            that._loadTemplatesFromMarkupCore(domUtils.createMarkupFromString(data));
            deferred.resolve();
        }).fail(function(jqXHR, textStatus, errorThrown) {
            var error = errors.Error("E3021", url, errorThrown);
            deferred.reject(error);
        });

        return deferred.promise();
    },

    _getWinPhonePrefix: function() {
        if(window.location.protocol.indexOf("wmapp") >= 0) {
            return window.location.protocol + "www/";
        }

        return "";
    },

    _loadExternalTemplates: function() {
        var tasks = [],
            that = this;

        $("head").find("link[rel='dx-template']").each(function(index, link) {
            var task = that._loadTemplatesFromURL($(link).attr("href"));
            tasks.push(task);
        });

        return when.apply($, tasks);
    },

    _processTemplates: function() {
        var that = this;

        each(that._templateMap, function(name, templatesByRoleMap) {
            each(templatesByRoleMap, function(role, templates) {
                that._filterTemplatesByDevice(templates);
            });
        });

        that._enumerateTemplates(function(template) {
            that._applyPartialViews(template.element());
        });
    },

    _filterTemplatesByDevice: function(components) {
        var filteredComponents = this._filterTemplates(this.device, components);

        each(components, function(index, component) {
            if(inArray(component, filteredComponents) < 0) {
                component.element().remove();
            }
        });

        components.length = 0;
        components.push.apply(components, filteredComponents);
    },

    _filterTemplates: function(filter, components) {
        return commonUtils.findBestMatches(filter, components, function(component) {
            return component.option();
        });
    },

    _checkMatchedTemplates: function(bestMatches) {
        if(bestMatches.length > 1) {
            var message = "";
            each(bestMatches, function(index, match) {
                message += match.element().attr("data-options") + "\r\n";
            });
            throw errors.Error("E3020", message, JSON.stringify(this.device));
        }
    },

    _wrapViewDefaultContent: function($viewTemplate) {
        $viewTemplate.wrapInner("<div class=\"dx-full-height\"></div>");
        $viewTemplate.children().eq(0).dxContent({ targetPlaceholder: 'content' });
    },

    _initDefaultLayout: function() {
        this._$defaultLayoutTemplate = $("<div class=\"dx-full-height\" data-options=\"dxLayout : { name: 'default' } \"> \n"
        + "    <div class=\"dx-full-height\" data-options=\"dxContentPlaceholder : { name: 'content' } \" ></div> \n"
        + "</div>");
        domUtils.createComponents(this._$defaultLayoutTemplate);
    },

    _getDefaultLayoutTemplate: function() {
        return this._$defaultLayoutTemplate.clone();
    },

    applyLayout: function($view, $layout) {
        if($layout === undefined || $layout.length === 0) {
            $layout = this._getDefaultLayoutTemplate();
        }
        if($view.children(".dx-content").length === 0) {
            this._wrapViewDefaultContent($view);
        }
        var $toMerge = $().add($layout).add($view);
        var $placeholderContents = $toMerge.find(".dx-content");
        each($placeholderContents, function() {
            var $placeholderContent = $(this);
            var placeholderId = $placeholderContent.attr("data-dx-target-placeholder-id");
            var $placeholder = $toMerge.find(".dx-content-placeholder-" + placeholderId);
            $placeholder.empty();
            $placeholder.append($placeholderContent);
        });

        for(var i = $placeholderContents.length; i >= 0; i--) {
            var $item = $placeholderContents.eq(i);
            if(!$item.is(".dx-content-placeholder .dx-content")) {
                $item.remove();
            }
        }
        return $layout;
    },

    _loadTemplatesFromCache: function() {
        if(!this._templateCacheEnabled) return;

        var cache;

        var fromJSONInterceptor = function(key, value) {
            if(typeof value === "string" && value.indexOf(MARKUP_TEMPLATE_MARKER) === 0) {
                var data = JSON.parse(value.substr(MARKUP_TEMPLATE_MARKER.length)),
                    type = data.type,
                    options = data.options,
                    $markup = domUtils.createMarkupFromString(data.markup);

                options.fromCache = true;
                return $markup[type](options)[type]("instance");
            } else if(key === "skippedMarkup") {
                return $("<div>").append(domUtils.createMarkupFromString(value)).contents();
            }
            return value;
        };

        var toParse = this._templateCacheStorage.getItem(this._templateCacheKey);

        if(toParse) {
            try {
                var cacheContainer = JSON.parse(toParse, fromJSONInterceptor);
                cache = cacheContainer[this._templatesVersion];
            } catch(e) {
                this._clearCache();
            }
        }

        if(!cache) return;

        this._templateMap = cache.templates;
        this.$root.append(cache.skippedMarkup);

        return true;
    },

    _putTemplatesToCache: function() {
        if(!this._templateCacheEnabled) return;

        var toJSONInterceptor = function(key, value) {
            if(value && value.element) {
                return MARKUP_TEMPLATE_MARKER + JSON.stringify({
                    markup: value.element().prop("outerHTML"),
                    options: value.option(),
                    type: value.NAME
                });
            } else if(key === "skippedMarkup") {
                return $("<div>").append(value.clone()).html();
            }
            return value;
        };

        var cacheContainer = {};
        cacheContainer[this._templatesVersion] = {
            templates: this._templateMap,
            skippedMarkup: this._$skippedMarkup
        };
        this._templateCacheStorage.setItem(this._templateCacheKey, JSON.stringify(cacheContainer, toJSONInterceptor, 4));
    },

    init: function() {
        var that = this;

        this._initDefaultLayout();

        if(!this._loadTemplatesFromCache()) {
            that._loadTemplatesFromMarkupCore(that.$root.children());
            return this._loadExternalTemplates().done(function() {
                that._processTemplates();
                that._putTemplatesToCache();
            });
        } else {
            return $.Deferred().resolve().promise();
        }
    },

    getViewTemplate: function(viewName) {
        return this._findTemplate(viewName, _VIEW_ROLE);
    },

    getViewTemplateInfo: function(name) {
        return this._findComponent(name, _VIEW_ROLE);
    },

    getLayoutTemplate: function(layoutName) {
        if(!layoutName) {
            return this._getDefaultLayoutTemplate();
        }
        return this._findTemplate(layoutName, _LAYOUT_ROLE);
    },

    getLayoutTemplateInfo: function(name) {
        return this._findComponent(name, _LAYOUT_ROLE);
    },

    loadTemplates: function(source) {
        var result;

        if(typeof (source) === "string") {
            result = this._loadTemplatesFromURL(source);
        } else {
            this._loadTemplatesFromMarkupCore(source);
            result = $.Deferred().resolve().promise();
        }

        return result.done(this._processTemplates.bind(this));
    }
});

exports.ViewEngine = ViewEngine;
