import { TemplateBase } from '@ts/core/templates/template_base';

export class ChildDefaultTemplate extends TemplateBase {
  name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }
}
