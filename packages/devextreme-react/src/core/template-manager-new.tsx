import * as React from 'react';
import * as events from 'devextreme/events';
import { useState, useEffect, useCallback, useMemo, FC } from 'react';
import { TemplateManagerProps, RenderedTemplateInstances, GetRenderFuncFn, DXTemplateCollection, TemplateFunc, TemplateInstanceDefinition } from './types-new';
import TemplateWrapper from './template-wrapper-new';
import { DoubleKeyMap } from './helpers';
import { DX_REMOVE_EVENT } from './component-base';
import { ITemplateArgs } from './template';
import { getOption as getConfigOption } from './config';

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

export const TemplateManager: FC<TemplateManagerProps> = ({ init, templateOptions, dryRun }) => {
  const [renderedInstances, setRenderedInstances] = useState<RenderedTemplateInstances>(new DoubleKeyMap<any, HTMLElement, TemplateInstanceDefinition>());

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

  const getRandomId = useCallback(() => Math.floor(Math.random() * 100000).toString(), []); 

  const createMapKey = useCallback((key1: any, key2: HTMLElement) => {
    return { key1, key2 };
  }, []);

  const templateFactories = useMemo(() => Object.entries(templateOptions).reduce((res, [key, template]) => {
    let templateFunc: TemplateFunc;

    switch(template.type) {
      case 'children': templateFunc = () => {
        return template.content;
      }
      break;

      case 'render': templateFunc = (props) => {
        normalizeProps(props);
        return template.content(props.data, props.index)
      }; 
      break;

      case 'component': templateFunc = (props) => {
        props = normalizeProps(props);
        return React.createElement.bind(null, template.content)(props)
      }; 
      break;

      default: templateFunc = () => React.createElement(React.Fragment);
    }

    return {
      ...res,
      [key]: templateFunc
    }
  }, {} as Record<string, TemplateFunc>), [templateOptions]);

  const getRenderFunc: GetRenderFuncFn = useCallback((templateKey) => ({ model: data, index, container, onRendered }) => {
    const key = createMapKey(data, container);
  
    const onRemoved = () => {
      setRenderedInstances(renderedInstances => {
        const template = renderedInstances.get(key);
        
        if (template) {
          renderedInstances.delete(key);

          return renderedInstances.shallowCopy();
        }

        return renderedInstances;
      })
    };
  
    setRenderedInstances(renderedInstances => {
      renderedInstances.set(key, {
        templateKey,
        index,
        componentKey: getRandomId(),
        onRendered: () => {
          unsubscribeOnRemoval(container, onRemoved);
          onRendered?.();
        },
        onRemoved
      })

      return renderedInstances.shallowCopy();
      
    });

  }, [unsubscribeOnRemoval, getRandomId, createMapKey]);

  useEffect(() => {
    if (dryRun) {
      return;
    }

    const dxTemplates = Object.entries(templateFactories)
      .reduce<DXTemplateCollection>((dxTemplates, [templateKey,]) => {
        dxTemplates[templateKey] = { render: getRenderFunc(templateKey) };
        return dxTemplates;
      }, {});

    init(dxTemplates);
  }, [init, getRenderFunc, templateFactories, dryRun]);

  if (renderedInstances.empty || dryRun && Object.keys(templateOptions).length === 0)
    return null;

  return (
    <>
      {
        Array.from(renderedInstances).map(([{ key1: data, key2: container }, {
          index,
          templateKey,
          componentKey,
          onRendered,
          onRemoved
         }]) => {
          subscribeOnRemoval(container, onRemoved);
          
          return <TemplateWrapper
            key={componentKey}
            content={templateFactories[templateKey]({ data, index, onRendered })}
            container={container}
            onRemoved={onRemoved}
            onRendered={onRendered}
          />
        })
      }
    </>
  )
}