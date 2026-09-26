import { TemplateBase } from '@js/core/templates/template_base';
import { normalizeTemplateElement } from '@js/core/utils/dom';

export class FunctionTemplate extends TemplateBase {
  _render: any;

  constructor(render) {
    super();
    this._render = render;
  }

  // @ts-expect-error need type overload
  _renderCore(options) {
    return normalizeTemplateElement(this._render(options));
  }
}
