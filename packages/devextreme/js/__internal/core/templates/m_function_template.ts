import { normalizeTemplateElement } from '../utils/dom';
import { TemplateBase } from './template_base';

export class FunctionTemplate extends TemplateBase {
  constructor(render) {
    super();
    this._render = render;
  }

  _renderCore(options) {
    return normalizeTemplateElement(this._render(options));
  }
}
