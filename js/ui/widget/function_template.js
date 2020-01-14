const TemplateBase = require('./ui.template_base');
const domUtils = require('../../core/utils/dom');

const FunctionTemplate = TemplateBase.inherit({

    ctor: function(render) {
        this._render = render;
    },

    _renderCore: function(options) {
        return domUtils.normalizeTemplateElement(this._render(options));
    }

});


module.exports = FunctionTemplate;
