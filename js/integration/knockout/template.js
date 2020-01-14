const $ = require('../../core/renderer');
const domAdapter = require('../../core/dom_adapter');
const ko = require('knockout');
const typeUtils = require('../../core/utils/type');
const TemplateBase = require('../../ui/widget/ui.template_base');
const domUtils = require('../../core/utils/dom');
const getClosestNodeWithContext = require('./utils').getClosestNodeWithContext;

const getParentContext = function(data) {
    const parentNode = domAdapter.createElement('div');

    ko.applyBindingsToNode(parentNode, null, data);
    const parentContext = ko.contextFor(parentNode);

    ko.cleanNode(parentNode);

    return parentContext;
};

const KoTemplate = TemplateBase.inherit({

    ctor: function(element) {
        this._element = element;

        this._template = $('<div>').append(domUtils.normalizeTemplateElement(element));
        this._registerKoTemplate();
    },

    _registerKoTemplate: function() {
        const template = this._template.get(0);
        new ko.templateSources.anonymousTemplate(template)['nodes'](template);
    },

    _prepareDataForContainer: function(data, container) {
        if(container && container.length) {
            const containerElement = container.get(0);
            const node = getClosestNodeWithContext(containerElement);
            const containerContext = ko.contextFor(node);
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
        const model = this._prepareDataForContainer(options.model, $(options.container));

        if(typeUtils.isDefined(options.index)) {
            model.$index = options.index;
        }

        const $placeholder = $('<div>').appendTo(options.container);

        let $result;
        ko.renderTemplate(this._template.get(0), model, {
            afterRender: function(nodes) {
                $result = $(nodes);
            }
        }, $placeholder.get(0), 'replaceNode');

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
