import * as React from 'react';
import * as events from 'devextreme/events';
import { useState, useEffect, useCallback, FC } from 'react';
import { TemplateManagerProps, RenderedTemplateInstances, GetRenderFuncFn, DXTemplateCollection, TemplateFunc, TemplateInstanceDefinition } from './types-new';
import TemplateWrapper from './template-wrapper-new';
import { DoubleKeyMap } from './helpers';
import { DX_REMOVE_EVENT } from './component-base';
import { ITemplateArgs } from './template';
import { getOption as getConfigOption } from './config';

export const TemplateManager: FC<TemplateManagerProps> = ({ init, templateOptions }) => {
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

  const createMapKey = (key1: any, key2: HTMLElement) => {
    return { key1, key2 };
  }

  const getRenderFunc: GetRenderFuncFn = useCallback((getJSX) => ({ model: data, index, container, onRendered }) => {
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
        getJSX,
        index,
        componentKey: getRandomId(),
        onRendered: () => {
          unsubscribeOnRemoval(container, onRemoved);
          onRendered();
        },
        onRemoved
      })

      return renderedInstances.shallowCopy();
      
    });

  }, [unsubscribeOnRemoval, getRandomId]);

  useEffect(() => {
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

    const templateFactories = Object.entries(templateOptions).reduce((res, [key, template]) => {
      let templateFunc: TemplateFunc;

      switch(template.type) {
        case 'children': templateFunc = () => template.content;
        break;

        case 'render': templateFunc = (props) => {
          normalizeProps(props);
          return template.content(props.data, props.index)
        }; 
        break;

        case 'component': templateFunc = (props) => {
          props = normalizeProps(props);
          return React.createElement.bind(null, template.content)(props.data)
        }; 
        break;

        default: templateFunc = () => React.createElement(React.Fragment);
      }

      return {
        ...res,
        [key]: templateFunc
      }
    }, {} as Record<string, TemplateFunc>)

    const dxTemplates = Object.entries(templateFactories)
      .reduce<DXTemplateCollection>((dxTemplates, [templateKey, factory]) => {
        dxTemplates[templateKey] = { render: getRenderFunc(factory) };
        return dxTemplates;
      }, {});

    init(dxTemplates);
  }, [init, getRenderFunc, templateOptions]);

  if (renderedInstances.empty)
    return null;

  return (
    <>
      {
        Array.from(renderedInstances).map(([{ key1: data, key2: container }, {
          index,
          componentKey,
          getJSX,
          onRendered,
          onRemoved
         }]) => {
          subscribeOnRemoval(container, onRemoved);
          
          return <TemplateWrapper
            key={componentKey}
            data={data}
            index={index}
            container={container}
            templateFactory={getJSX}
            onRemoved={onRemoved}
            onRendered={onRendered}
          />
        })
      }
    </>
  )
}