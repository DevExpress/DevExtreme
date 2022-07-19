import * as React from 'react';

import { DoubleKeyMap, generateID } from './helpers';
import { ITemplateArgs } from './template';
import { ITemplateWrapperProps, TemplateWrapper } from './template-wrapper';
import { TemplatesStore } from './templates-store';
import {DX_REMOVE_EVENT} from "./component-base";
import * as events from 'devextreme/events';

interface IDxTemplate {
  render: (data: IDxTemplateData) => any;
}

interface IDxTemplateData {
  container: any;
  model?: any;
  index?: any;
  onRendered?: () => void;
}

function unwrapElement(element: any): HTMLElement {
  return element.get ? element.get(0) : element;
}

function createDxTemplate(
  createContentProvider: () => (props: ITemplateArgs) => any,
  templatesStore: TemplatesStore,
  keyFn?: (data: any) => string,
): IDxTemplate {
  const renderedTemplates = new DoubleKeyMap<any, HTMLElement | null, string>();

  return {
    render: (data: IDxTemplateData) => {
      const container = unwrapElement(data.container);
      const key = { key1: data.model, key2: container };
      const prevTemplateId = renderedTemplates.get(key);

      let templateId: string;

      const onRemoved = (): void => {
        templatesStore.setDeferredRemove(templateId, true);
        renderedTemplates.delete(key);
      };

      const _subscribeOnContainerRemoval = (): void =>  {
        if (container.nodeType === Node.ELEMENT_NODE) {
          events.one(container, DX_REMOVE_EVENT, onRemoved);
        }
      }

      const _unsubscribeOnContainerRemoval = (): void =>  {
        if (container.nodeType === Node.ELEMENT_NODE) {
          events.off(container, DX_REMOVE_EVENT, onRemoved);
        }
      }

      if (prevTemplateId) {
        templateId = prevTemplateId;
      } else {
        templateId = keyFn ? keyFn(data.model) : `__template_${generateID()}`;

        if (data.model !== undefined) {
          renderedTemplates.set(key, templateId);
        }
      }

      _subscribeOnContainerRemoval();

      templatesStore.add(templateId, () => {

        const props: ITemplateArgs = {
          data: data.model,
          index: data.index,
        };

        const contentProvider = createContentProvider();
        return React.createElement<ITemplateWrapperProps>(
          TemplateWrapper,
          {
            content: contentProvider(props),
            container,
            onRemoved,
            onDidMount: () => {
              _unsubscribeOnContainerRemoval();
              templatesStore.setDeferredRemove(templateId, false);
              data.onRendered?.();
            },
            key: templateId,
          },
        ) as any as TemplateWrapper;
      });

      return container;
    },
  };
}

export {
  IDxTemplate,
  createDxTemplate,
};
