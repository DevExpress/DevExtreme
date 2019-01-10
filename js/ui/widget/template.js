var $ = require("../../core/renderer"),
    TemplateBase = require("./ui.template_base"),
    templateEngine = require("./template_engine");

var Template = TemplateBase.inherit({

    ctor: function(element) {
        this._element = element;
    },

    _renderCore: function(options) {
        const transclude = options.transclude;
        if(!transclude && !this._compiledTemplate) {
            debugger;
            this._compiledTemplate = templateEngine.getCurrentTemplateEngine().compile(this._element);
        }

        return $("<div>").append(
            transclude ? this._element : templateEngine.getCurrentTemplateEngine().render(this._compiledTemplate, options.model, options.index)
        ).contents();
    },

    source: function() {
        return $(this._element).clone();
    }

});

module.exports = Template;
