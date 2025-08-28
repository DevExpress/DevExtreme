import * as React from 'react';
import * as events from 'devextreme/events';

import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
  FC,
} from 'react';

import {
  TemplateManagerProps,
  GetRenderFuncFn,
  DXTemplateCollection,
  TemplateFunc,
  TemplateManagerUpdateContext,
} from './types';

import { TemplateWrapper } from './template-wrapper';
import { TemplateInstantiationModels, generateID } from './helpers';
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

const createMapKey = (key1: any, key2: HTMLElement) => ({ key1, key2 });

const unsubscribeOnRemoval = (container: HTMLElement, onContainerRemoved: () => void) => {
  if (container.nodeType === Node.ELEMENT_NODE) {
    events.off(container, DX_REMOVE_EVENT, onContainerRemoved);
  }
};

const subscribeOnRemoval = (container: HTMLElement, onContainerRemoved: () => void) => {
  if (container.nodeType === Node.ELEMENT_NODE) {
    events.on(container, DX_REMOVE_EVENT, onContainerRemoved);
  }
};

const unwrapElement = (element: any): HTMLElement => (element.get ? element.get(0) : element);

const getRandomId = () => `${generateID()}${generateID()}${generateID()}`;

export const TemplateManager: FC<TemplateManagerProps> = ({ init, onTemplatesRendered }) => {
  const mounted = useRef(false);
  const [instantiationModels, setInstantiationModels] = useState({
    collection: new TemplateInstantiationModels(),
  });
  const [updateContext, setUpdateContext] = useState<TemplateManagerUpdateContext>();
  const widgetId = useRef('');
  const templateFactories = useRef<Record<string, TemplateFunc>>({});

  const { collection } = instantiationModels;

  const getRenderFunc: GetRenderFuncFn = useCallback((templateKey) => ({
    model: data,
    index,
    container,
    onRendered,
  }) => {
    const containerElement = unwrapElement(container);
    const key = createMapKey(data, containerElement);

    const onRemoved = (componentKey?: string): void => {
      const model = collection.get(key);

      if (model && (!componentKey || model.componentKey === componentKey)) {
        collection.delete(key);
        setInstantiationModels({ collection });
      }
    };

    const onContainerRemoved = (): void => {
      onRemoved();
    };

    const hostWidgetId = widgetId.current;

    collection.set(key, {
      templateKey,
      index,
      componentKey: getRandomId(),
      onRendered: () => {
        unsubscribeOnRemoval(containerElement, onContainerRemoved);

        if (hostWidgetId === widgetId.current) {
          onRendered?.();
        }
      },
      onRemoved,
      onContainerRemoved,
    });

    setInstantiationModels({ collection });

    return containerElement;
  }, [collection]);

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

    function createDXTemplates(templateOptions: Record<string, ITemplate>): DXTemplateCollection {
      const factories = Object.entries(templateOptions)
        .reduce<Record<string, TemplateFunc>>((res, [key, template]) => (
        {
          ...res,
          [key]: getTemplateFunction(template),
        }
      ), {});

      templateFactories.current = factories;

      const dxTemplates = Object.keys(factories)
        .reduce<DXTemplateCollection>((templates, templateKey) => {
        templates[templateKey] = { render: getRenderFunc(templateKey) };

        return templates;
      }, {});

      return dxTemplates;
    }

    function clearInstantiationModels(): void {
      widgetId.current = getRandomId();
      instantiationModels.collection.clear();
      setInstantiationModels({ ...instantiationModels });
    }

    function updateTemplates(onUpdated: () => void): void {
      if (mounted.current) {
        setUpdateContext({ onUpdated });
      }
    }

    init({ createDXTemplates, clearInstantiationModels, updateTemplates });
  }, [init, getRenderFunc]);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (updateContext) {
      updateContext.onUpdated();
    }
    onTemplatesRendered();
  }, [updateContext, onTemplatesRendered]);

  if (instantiationModels.collection.empty) {
    return null;
  }

  return (
    <>
      {
        Array.from(instantiationModels.collection).map(([{ key1: data, key2: container }, {
          index,
          templateKey,
          componentKey,
          onRendered,
          onRemoved,
          onContainerRemoved,
        }]) => {
          subscribeOnRemoval(container, onContainerRemoved);

          const factory = templateFactories.current[templateKey];

          if (factory) {
            return <TemplateWrapper
              key={componentKey}
              componentKey={componentKey}
              templateFactory={factory}
              data={data}
              index={index}
              container={container}
              onRemoved={onRemoved}
              onRendered={onRendered}
            />;
          }

          return null;
        })
      }
    </>
  );
};
