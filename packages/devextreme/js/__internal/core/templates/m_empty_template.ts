import $ from '@js/core/renderer';
import { TemplateBase } from '@js/core/templates/template_base';

export class EmptyTemplate extends TemplateBase {
  _renderCore() {
    return $();
  }
}
