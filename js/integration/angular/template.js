import $ from '../../core/renderer';
import { TemplateBase } from '../../core/templates/template_base';
import { isFunction } from '../../core/utils/type';
import { normalizeTemplateElement } from '../../core/utils/dom';

export const NgTemplate = class extends TemplateBase {
    constructor(element, templateCompiler) {
        super();
        this._element = element;

        this._compiledTemplate = templateCompiler(normalizeTemplateElement(this._element));
    }

    _renderCore(options) {
        const compiledTemplate = this._compiledTemplate;

        return isFunction(compiledTemplate) ? compiledTemplate(options) : compiledTemplate;
    }

    source() {
        return $(this._element).clone();
    }
};
