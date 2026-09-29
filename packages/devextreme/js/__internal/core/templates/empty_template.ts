import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { TemplateBase } from '@ts/core/templates/template_base';

export class EmptyTemplate extends TemplateBase {
  _renderCore(): dxElementWrapper {
    return $();
  }
}
