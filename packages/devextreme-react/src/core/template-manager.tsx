import * as React from 'react';
import * as events from 'devextreme/events';

import {
  useState,
  useMemo,
  useCallback,
  useRef,
  FC,
} from 'react';

import {
  TemplateManagerProps,
  GetRenderFuncFn,
  DXTemplateCollection,
  TemplateFunc,
} from './types';

import TemplateWrapper from './template-wrapper';
import { RenderedTemplateInstances, generateID } from './helpers';
import { DX_REMOVE_EVENT } from './component-base';
import { ITemplateArgs } from './template';
import { getOption as getConfigOption } from './config';
import { ITemplate } from './configuration/config-node';

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

export const TemplateManager: FC<TemplateManagerProps> = ({ init }) => {
  const [renderedInstances, setRenderedInstances] = useState(new RenderedTemplateInstances());
  const [templateFactories, setTemplateFactories] = useState<Record<string, TemplateFunc>>({});
  const widgetId = useRef('');

  const subscribeOnRemoval = useCallback((container: HTMLElement, onRemoved: () => void) => {
    if (container.nodeType === Node.ELEMENT_NODE) {
      events.on(container, DX_REMOVE_EVENT, onRemoved);
    }
  }, []);

  const unsubscribeOnRemoval = useCallback((container: HTMLElement, onRemoved: () => void) => {
    if (container.nodeType === Node.ELEMENT_NODE) {
      events.off(container, DX_REMOVE_EVENT, onRemoved);
    }
  }, []);

  const createMapKey = useCallback((key1: any, key2: HTMLElement) => ({ key1, key2 }), []);

  const getRandomId = useCallback(() => `${generateID()}${generateID()}${generateID()}`, []);

  const getRenderFunc: GetRenderFuncFn = useCallback((templateKey) => ({
    model: data,
    index,
    container,
    onRendered,
  }) => {
    const key = createMapKey(data, container);

    const onRemoved = (): void => {
      setRenderedInstances((currentRenderedInstances) => {
        const template = currentRenderedInstances.get(key);

        if (template) {
          currentRenderedInstances.delete(key);

          return currentRenderedInstances.shallowCopy();
        }

        return currentRenderedInstances;
      });
    };

    const hostWidgetId = widgetId.current;

    setRenderedInstances((currentRenderedInstances) => {
      currentRenderedInstances.set(key, {
        templateKey,
        index,
        componentKey: getRandomId(),
        onRendered: () => {
          unsubscribeOnRemoval(container, onRemoved);

          if (hostWidgetId === widgetId.current) {
            onRendered?.();
          }
        },
        onRemoved,
      });

      return currentRenderedInstances.shallowCopy();
    });
  }, [unsubscribeOnRemoval, createMapKey]);

  useMemo(() => {
    function getTemplateFunction(template: ITemplate): TemplateFunc {
      switch (template.type) {
        case 'children': return () => template.content as JSX.Element;

        case 'render': return (props) => {
          normalizeProps(props);
          return template.content(props.data, props.index) as JSX.Element;
        };

        case 'component': return (props) => {
          props = normalizeProps(props);
          return React.createElement.bind(null, template.content)(props) as JSX.Element;
        };

        default: return () => React.createElement(React.Fragment);
      }
    }

    function getDXTemplates(templateOptions: Record<string, ITemplate>): DXTemplateCollection {
      const factories = Object.entries(templateOptions)
        .reduce((res, [key, template]) => (
          {
            ...res,
            [key]: getTemplateFunction(template),
          }
        ), {});

      setTemplateFactories(factories);

      const dxTemplates = Object.keys(factories)
        .reduce<DXTemplateCollection>((templates, templateKey) => {
          templates[templateKey] = { render: getRenderFunc(templateKey) };

          return templates;
        }, {});

      return dxTemplates;
    }

    function clearRenderedInstances(): void {
      widgetId.current = getRandomId();
      setRenderedInstances(new RenderedTemplateInstances());
    }

    init(getDXTemplates, clearRenderedInstances);
  }, [init, getRenderFunc]);

  if (renderedInstances.empty) {
    return null;
  }

  return (
    <>
      {
        Array.from(renderedInstances).map(([{ key1: data, key2: container }, {
          index,
          templateKey,
          componentKey,
          onRendered,
          onRemoved,
        }]) => {
          subscribeOnRemoval(container, onRemoved);

          return <TemplateWrapper
            key={componentKey}
            templateFactory={templateFactories[templateKey]}
            data={data}
            index={index}
            container={container}
            onRemoved={onRemoved}
            onRendered={onRendered}
          />;
        })
      }
    </>
  );
};
