"use strict";

var $ = require("../../core/renderer"),
    ko = require("knockout"),
    commonUtils = require("../../core/utils/common"),
    TemplateBase = require("../../ui/widget/ui.template_base"),
    domUtils = require("../../core/utils/dom");

var KoTemplate = TemplateBase.inherit({

    ctor: function(element) {
        this._element = element;

        this._template = $("<div>").append(domUtils.normalizeTemplateElement(element));
        this._registerKoTemplate();
    },

    _registerKoTemplate: function() {
        var template = this._template.get(0);
        new ko.templateSources.anonymousTemplate(template)['nodes'](template);
    },

    _prepareDataForContainer: function(data, container) {
        if(container && container.length) {
            var containerElement = container.get(0);
            var containerContext = ko.contextFor(containerElement);

            data = data !== undefined ? data : ko.dataFor(containerElement) || {};

            if(containerContext) {
                return (data === containerContext.$data)
                    ? containerContext
                    : containerContext.createChildContext(data);
            }
        }

        return new ko.bindingContext(data);
    },

    _renderCore: function(options) {
        var model = this._prepareDataForContainer(options.model, options.container);

        if(commonUtils.isDefined(options.index)) {
            model.$index = options.index;
        }

        var $placeholder = $("<div>").appendTo(options.container);

        var $result;
        ko.renderTemplate(this._template.get(0), model, {
            afterRender: function(nodes) {
                $result = $(nodes);
            }
        }, $placeholder.get(0), "replaceNode");

        return $result;
    },

    source: function() {
        return $(this._element).clone();
    },

    dispose: function() {
        this._template.remove();
    }

});

module.exports = KoTemplate;
