import React, { useCallback, useLayoutEffect, useEffect, useState, memo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { DX_REMOVE_EVENT } from './component-base';
import { TemplateWrapperProps } from './types-new';
import * as events from 'devextreme/events';
import { OnRenderedLockerContext } from './helpers';

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

const TemplateWrapper = memo(function TemplateWrapper({ templateFactory, data, index, container, onRemoved, onRendered }: TemplateWrapperProps) {
  let onRenderedLock = useRef(0);
  
  const [removalListenerRequired, setRemovalListenerRequired] = useState(false);
  const [onRenderedLocker] = useState({
    lock: () => onRenderedLock.current++,
    unlock: () => {
      onRenderedLock.current--;

      if (onRenderedLock.current === 0)
        onRendered();
    }
  });

  const onTemplateRemoved = useCallback(() => {
    if (element.current) {
      events.off(element.current, DX_REMOVE_EVENT, onTemplateRemoved);
    }

    if (removalListenerElement.current) {
      events.off(removalListenerElement.current, DX_REMOVE_EVENT, onTemplateRemoved);
    }

    onRemoved();
  }, [onRemoved]);

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
  }, [onTemplateRemoved, removalListenerRequired, container]);

  useEffect(() => {
    if (onRenderedLock.current === 0) {
      onRendered();
    }
  }, [onRendered]);

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
        <OnRenderedLockerContext.Provider value={onRenderedLocker}>
          {
            templateFactory?.({
              data,
              index,
              onRendered
            }, {}) || 'empty'
          }
          { hiddenNode }
          { removalListener }
        </OnRenderedLockerContext.Provider>
      </>,
      container
    );
});

export default TemplateWrapper;
