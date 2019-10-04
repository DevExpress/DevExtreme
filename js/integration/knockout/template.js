var $ = require("../../core/renderer"),
    domAdapter = require("../../core/dom_adapter"),
    ko = require("knockout"),
    typeUtils = require("../../core/utils/type"),
    TemplateBase = require("../../ui/widget/ui.template_base"),
    domUtils = require("../../core/utils/dom"),
    getClosestNodeWithContext = require("./utils").getClosestNodeWithContext;

var getParentContext = function(data) {
    var parentNode = domAdapter.createElement("div");

    ko.applyBindingsToNode(parentNode, null, data);
    var parentContext = ko.contextFor(parentNode);

    ko.cleanNode(parentNode);

    return parentContext;
};

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
            var node = getClosestNodeWithContext(containerElement);
            var containerContext = ko.contextFor(node);
            data = data !== undefined ? data : ko.dataFor(node) || {};

            if(containerContext) {
                return (data === containerContext.$data)
                    ? containerContext
                    : containerContext.createChildContext(data);
            }
        }

        // workaround for https://github.com/knockout/knockout/pull/651
        return getParentContext(data).createChildContext(data);
    },

    _renderCore: function(options) {
        var model = this._prepareDataForContainer(options.model, $(options.container));

        if(typeUtils.isDefined(options.index)) {
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
