import { ComponentPublicInstance, Slot } from 'vue';

import domAdapter from 'devextreme/core/dom_adapter';
import { one } from 'devextreme/events';
import {
  discover as discoverSlots,
  mountTemplate,
} from './templates-discovering';
import { DX_REMOVE_EVENT, DX_TEMPLATE_WRAPPER_CLASS } from './constants';
import { allKeysAreEqual } from './helpers';

class TemplatesManager {
  private readonly _component: ComponentPublicInstance;

  private _slots: Record<string, Slot> = {};

  private _templates: Record<string, object> = {};

  private _isDirty = false;

  constructor(component: ComponentPublicInstance) {
    this._component = component;
    this.discover();
  }

  public discover() {
    this._slots = {
      ...discoverSlots(this._component),
    };

    if (!allKeysAreEqual(this._templates, this._slots)) {
      this._prepareTemplates();
    }
  }

  public get templates() {
    return this._templates;
  }

  public get isDirty() {
    return this._isDirty;
  }

  public resetDirtyFlag() {
    this._isDirty = false;
  }

  private _prepareTemplates() {
    this._templates = {};

    for (const name of Object.keys(this._slots)) {
      this._templates[name] = this.createDxTemplate(name);
    }

    this._isDirty = true;
  }

  private createDxTemplate(name: string) {
    return {
      render: (data: any) => {
        const rendered = ((onRendered, counter = 0) => () => {
          if (counter === 1 && onRendered) {
            onRendered();
          }
          counter++;
        })(data.onRendered);
        const scopeData = { data: data.model, index: data.index, onRendered: rendered };

        const placeholder = document.createElement('div');
        const container = data.container.get ? data.container.get(0) : data.container;
        container.appendChild(placeholder);
        const mountedTemplate = mountTemplate(
          () => this._slots[name],
          this._component,
          scopeData,
          name,
          placeholder,
        );

        const element = mountedTemplate.$el as HTMLElement;
        container.removeChild(placeholder);

        let hasOnlyText = true;

        while (placeholder.firstChild) {
          hasOnlyText = hasOnlyText && placeholder.firstChild.nodeType !== 1;
          container.appendChild(placeholder.firstChild);
        }

        domAdapter.setClass(element, DX_TEMPLATE_WRAPPER_CLASS, true);

        if (hasOnlyText) {
          const removalListener = document.createElement(container.nodeName === 'TABLE' ? 'tbody' : 'span');
          removalListener.style.display = 'none';
          container.appendChild(removalListener);

          one(
            removalListener,
            DX_REMOVE_EVENT,
            mountedTemplate.$.appContext.app.unmount.bind(mountedTemplate),
          );
        } else {
           one(
            element,
            DX_REMOVE_EVENT,
            mountedTemplate.$.appContext.app.unmount.bind(mountedTemplate),
          );
        }
        rendered();
        return element;
      },
    };
  }
}

export { TemplatesManager };
