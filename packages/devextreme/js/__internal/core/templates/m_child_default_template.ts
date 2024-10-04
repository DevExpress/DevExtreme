import { TemplateBase } from '@js/core/templates/template_base';

export class ChildDefaultTemplate extends TemplateBase {
  name: any;

  constructor(name) {
    super();
    this.name = name;
  }
}
