var TemplateBase = require('./ui.template_base'),
    domUtils = require('../../core/utils/dom');

var FunctionTemplate = TemplateBase.inherit({

    ctor: function(render) {
        this._render = render;
    },

    _renderCore: function(options) {
        return domUtils.normalizeTemplateElement(this._render(options));
    }

});


module.exports = FunctionTemplate;
