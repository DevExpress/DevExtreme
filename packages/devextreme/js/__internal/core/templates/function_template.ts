import type { dxElementWrapper } from '@js/core/renderer';
import { normalizeTemplateElement } from '@js/core/utils/dom';
import type { TemplateRenderOptions } from '@ts/core/templates/template_base';
import { TemplateBase } from '@ts/core/templates/template_base';

export class FunctionTemplate<
  TOptions extends TemplateRenderOptions = TemplateRenderOptions,
> extends TemplateBase {
  _render: (options: TOptions) => unknown;

  constructor(render: (options: TOptions) => unknown) {
    super();
    this._render = render;
  }

  _renderCore(options: TOptions): dxElementWrapper {
    return normalizeTemplateElement(this._render(options));
  }
}
