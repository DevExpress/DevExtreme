const $ = require("../../core/renderer"),
    TemplateBase = require("./ui.template_base"),
    templateEngine = require("./template_engine");

const Template = TemplateBase.inherit({

    ctor: (element) => {
        this._element = element;
    },

    _renderCore: (options) => {
        const transclude = options.transclude;
        if(!transclude && !this._compiledTemplate) {
            this._compiledTemplate = templateEngine.getCurrentTemplateEngine().compile(this._element);
        }

        return $("<div>").append(
            transclude ? this._element : templateEngine.getCurrentTemplateEngine().render(this._compiledTemplate, options.model, options.index)
        ).contents();
    },

    source: () => {
        return $(this._element).clone();
    }

});

module.exports = Template;
