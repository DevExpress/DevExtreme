import React, { useCallback, useLayoutEffect, useState, memo, useRef } from 'react';
import './App.css';
import { createPortal } from 'react-dom';
import { DX_REMOVE_EVENT } from './component-base';
import { TemplateWrapperProps } from './types-new';
import * as events from 'devextreme/events';

const createHiddenNode = (containerNodeName: string, ref: React.LegacyRef<any>) => {
  const style = { display: 'none' };
  switch(containerNodeName) {
    case 'table':
      return <tbody style={style} ref={ref}></tbody>;
    case 'tbody':
      return <tr style={style} ref={ref}></tr>;
    default:
      return <div style={style} ref={ref}></div>
  }
};

const TemplateWrapper = memo(function TemplateWrapper({ templateFactory, data, container, onRemoved, onRendered }: TemplateWrapperProps) {
  const [removalListenerRequired, setRemovalListenerRequired] = useState(false);

  const onTemplateRemoved = useCallback(() => {
    if (element.current) {
      events.off(element.current, DX_REMOVE_EVENT, onTemplateRemoved);
    }

    if (removalListenerElement.current) {
      events.off(removalListenerElement.current, DX_REMOVE_EVENT, onTemplateRemoved);
    }

    onRemoved();
  }, [onRemoved])

  useLayoutEffect(() => {
    const el = element.current;

    if (el) {
      events.off(el, DX_REMOVE_EVENT, onTemplateRemoved);
      events.on(el, DX_REMOVE_EVENT, onTemplateRemoved);
    }

    if (!removalListenerRequired) {
      setRemovalListenerRequired(true);
    }
    else {
      events.off(removalListenerElement.current!, DX_REMOVE_EVENT, onTemplateRemoved);
      events.on(removalListenerElement.current!, DX_REMOVE_EVENT, onTemplateRemoved);
    }

    onRendered();

    return () => {
      if (element.current) {
        container.appendChild(element.current);
      }

      if (hiddenNodeElement.current) {
        container.appendChild(hiddenNodeElement.current);
      }

      if (removalListenerElement.current) {
        container.appendChild(removalListenerElement.current);
      }

      if (el) {
        events.off(el, DX_REMOVE_EVENT, onTemplateRemoved);
      }
    };
  }, [onRendered, onTemplateRemoved, removalListenerRequired, container]);

  const element = useRef<HTMLElement>();
  const hiddenNodeElement = useRef<HTMLElement>();
  const removalListenerElement = useRef<HTMLElement>();

  const hiddenNode = createHiddenNode(container?.nodeName, (node: HTMLElement) => {
    hiddenNodeElement.current = node as HTMLElement;
    element.current = node?.previousSibling as HTMLElement
  });

  const removalListener = removalListenerRequired
    ? <span style={{ display: 'none' }} ref={(node: HTMLElement) => { removalListenerElement.current = node }}></span>
    : undefined;

  return createPortal(
      <>
        {
          templateFactory?.({
            data,
            onRendered
          }, {}) || 'empty'
        }
        { hiddenNode }
        { removalListener }
      </>,
      container
    );
});

export default TemplateWrapper;
