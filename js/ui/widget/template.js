import $ from "../../core/renderer";
import TemplateBase from "./ui.template_base";
import { getCurrentTemplateEngine } from "./template_engine";

const Template = TemplateBase.inherit({

    ctor: function(element) {
        this._element = element;
    },

    _renderCore: function(options) {
        const transclude = options.transclude;
        if(!transclude && !this._compiledTemplate) {
            this._compiledTemplate = getCurrentTemplateEngine().compile(this._element);
        }

        return $("<div>").append(
            transclude ? this._element : getCurrentTemplateEngine().render(this._compiledTemplate, options.model, options.index)
        ).contents();
    },

    source: function() {
        return $(this._element).clone();
    }

});

module.exports = Template;
