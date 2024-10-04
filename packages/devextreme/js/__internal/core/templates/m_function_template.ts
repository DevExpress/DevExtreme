import { TemplateBase } from '@js/core/templates/template_base';
import { normalizeTemplateElement } from '@js/core/utils/dom';

export class FunctionTemplate extends TemplateBase {
  constructor(render) {
    super();
    this._render = render;
  }

  _renderCore(options) {
    return normalizeTemplateElement(this._render(options));
  }
}
