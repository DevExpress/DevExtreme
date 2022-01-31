import $ from '../renderer';
import { TemplateBase } from './template_base';
import { normalizeTemplateElement } from '../utils/dom';
import { getCurrentTemplateEngine, registerTemplateEngine, setTemplateEngine } from './template_engine_registry';
import './template_engines';

registerTemplateEngine('default', {
    compile: (element) => normalizeTemplateElement(element),
    render: (template, model, index) => template.clone()
});

setTemplateEngine('default');

export class Template extends TemplateBase {
    constructor(element) {
        super();
        this._element = element;
    }

    _renderCore(options) {
        const transclude = options.transclude;
        if(!transclude && !this._compiledTemplate) {
            this._compiledTemplate = getCurrentTemplateEngine().compile(this._element);
        }

        return $('<div>').append(
            transclude ? this._element : getCurrentTemplateEngine().render(this._compiledTemplate, options.model, options.index)
        ).contents();
    }

    source() {
        return $(this._element).clone();
    }
}
