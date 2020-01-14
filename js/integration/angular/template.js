const $ = require('../../core/renderer');
const TemplateBase = require('../../ui/widget/ui.template_base');
const isFunction = require('../../core/utils/type').isFunction;
const domUtils = require('../../core/utils/dom');

const NgTemplate = TemplateBase.inherit({

    ctor: function(element, templateCompiler) {
        this._element = element;

        this._compiledTemplate = templateCompiler(domUtils.normalizeTemplateElement(this._element));
    },

    _renderCore: function(options) {
        const compiledTemplate = this._compiledTemplate;

        return isFunction(compiledTemplate) ? compiledTemplate(options) : compiledTemplate;
    },

    source: function() {
        return $(this._element).clone();
    }

});

module.exports = NgTemplate;
