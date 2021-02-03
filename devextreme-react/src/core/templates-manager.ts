import * as React from 'react';

import { getOption as getConfigOption } from './config';
import { ITemplate } from './configuration/config-node';
import { createDxTemplate } from './dx-template';
import { ITemplateArgs } from './template';
import { TemplatesStore } from './templates-store';

function normalizeProps(props: ITemplateArgs): ITemplateArgs | ITemplateArgs['data'] {
  if (getConfigOption('useLegacyTemplateEngine')) {
    const model = props.data;
    if (model && Object.prototype.hasOwnProperty.call(model, 'key')) {
      model.dxkey = model.key;
    }
    return model;
  }
  return props;
}

type ContentGetter = () => any;

const contentCreators = {
  component: (contentGetter: ContentGetter) => (props: ITemplateArgs) => {
    props = normalizeProps(props);
    return React.createElement.bind(null, contentGetter())(props);
  },
  render: (contentGetter: ContentGetter) => (props: ITemplateArgs) => {
    normalizeProps(props);
    return contentGetter()(props.data, props.index);
  },
  children: (contentGetter: ContentGetter) => () => contentGetter(),
};

class TemplatesManager {
  private _templatesStore: TemplatesStore;

  private _templates: Record<string, any> = {};

  private _templatesContent: Record<string, any> = {};

  constructor(templatesStore: TemplatesStore) {
    this._templatesStore = templatesStore;
  }

  public add(name: string, template: ITemplate): void {
    this._templatesContent[name] = template.content;
    const contentCreator = contentCreators[template.type]
      .bind(this, () => this._templatesContent[name]);
    this._templates[name] = createDxTemplate(
      contentCreator,
      this._templatesStore,
      template.keyFn,
    );
  }

  public get templatesCount(): number {
    return Object.keys(this._templates).length;
  }

  public get templates(): Record<string, any> {
    return this._templates;
  }
}

export default TemplatesManager;
