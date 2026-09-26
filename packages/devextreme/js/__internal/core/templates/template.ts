import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { normalizeTemplateElement } from '@js/core/utils/dom';
import type { TemplateElement, TemplateRenderOptions } from '@ts/core/templates/template_base';
import { TemplateBase } from '@ts/core/templates/template_base';
import { getCurrentTemplateEngine, registerTemplateEngine, setTemplateEngine } from '@ts/core/templates/template_engine_registry';

registerTemplateEngine('default', {
  compile: (element) => normalizeTemplateElement(element),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: (template, model, index) => template.clone(),
});

setTemplateEngine('default');

export class Template extends TemplateBase {
  declare _element: TemplateElement;

  _compiledTemplate: unknown;

  constructor(element: TemplateElement) {
    super();
    this._element = element;
  }

  _renderCore(options: TemplateRenderOptions): dxElementWrapper {
    const { transclude } = options;
    if (!transclude && !this._compiledTemplate) {
      this._compiledTemplate = getCurrentTemplateEngine().compile(this._element);
    }

    return $('<div>').append(
      transclude
        ? this._element
        : getCurrentTemplateEngine().render(this._compiledTemplate, options.model, options.index),
    ).contents();
  }

  source(): dxElementWrapper {
    return $(this._element).clone();
  }
}
