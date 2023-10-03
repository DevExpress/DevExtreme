import * as React from 'react';
import * as events from 'devextreme/events';
import { useState, useEffect, useCallback, FC } from 'react';
import { TemplateManagerProps, RenderedTemplateInstances, GetRenderFuncFn, DXTemplateCollection, TemplateFunc } from './types-new';
import TemplateWrapper from './template-wrapper-new';
import sha1 from 'sha-1';
import jc from 'json-cycle';
import { DX_REMOVE_EVENT } from './component-base';
import { ITemplateArgs } from './template';
import { getOption as getConfigOption } from './config';


export const TemplateManager: FC<TemplateManagerProps> = ({ init, templateOptions }) => {
  const [renderedInstances, setRenderedInstances] = useState<RenderedTemplateInstances>({ containers: {}, instances: {} });

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

  const findContainerId = useCallback((container: HTMLElement, containerStorage: Record<string, HTMLElement>) => {
    const storedContainer = Object.entries(containerStorage).find(([ , element ]) => element === container);
    
    return storedContainer ? storedContainer[0] : null;
  }, []);

  const getHash = useCallback((data: any, containerId: string) => {
    return sha1(JSON.stringify({
      key1: jc.decycle(data),
      key2: containerId
    }));
  }, []);

  const getRenderFunc: GetRenderFuncFn = useCallback((getJSX) => ({ model: data, index, container, onRendered }) => {
    const onRemoved = () => {
      setRenderedInstances(renderedInstances => {
        const containerId = findContainerId(container, renderedInstances.containers);

        if (!containerId) {
          return renderedInstances;
        }  

        const hash = getHash(data, containerId);

        delete renderedInstances.instances[hash];

        const containerInUse = Object
          .values(renderedInstances.instances)
          .some(template => template.container === container);
        
        if (!containerInUse) {
          delete renderedInstances.containers[containerId];
        }

        return { ...renderedInstances };
      })
    };
  
    setRenderedInstances(renderedInstances => {
      const containerId = findContainerId(container, renderedInstances.containers) ?? getRandomId();
      const hash = getHash(data, containerId);

      return {
        containers: {
          ...renderedInstances.containers,
          [containerId]: container
        },
        instances: {
          ...renderedInstances.instances,
          [hash]: {
            data,
            container,
            getJSX,
            index,
            componentKey: getRandomId(),
            onRendered: () => {
              unsubscribeOnRemoval(container, onRemoved);
              onRendered();
            },
            onRemoved
          }
        }
      }
      
    });

  }, [unsubscribeOnRemoval, findContainerId, getRandomId, getHash]);

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

  if (!Object.keys(renderedInstances.instances).length)
    return null;

  return (
    <>
      {
        Object.values(renderedInstances.instances).map(({
          data,
          index,
          container,
          componentKey,
          getJSX,
          onRendered,
          onRemoved
         }) => {
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