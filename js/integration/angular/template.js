var $ = require('../../core/renderer'),
    TemplateBase = require('../../ui/widget/ui.template_base'),
    isFunction = require('../../core/utils/type').isFunction,
    domUtils = require('../../core/utils/dom');

var NgTemplate = TemplateBase.inherit({

    ctor: function(element, templateCompiler) {
        this._element = element;

        this._compiledTemplate = templateCompiler(domUtils.normalizeTemplateElement(this._element));
    },

    _renderCore: function(options) {
        var compiledTemplate = this._compiledTemplate;

        return isFunction(compiledTemplate) ? compiledTemplate(options) : compiledTemplate;
    },

    source: function() {
        return $(this._element).clone();
    }

});

module.exports = NgTemplate;
