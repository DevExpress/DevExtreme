import * as React from 'react';
import * as events from 'devextreme/events';

import {
  useCallback,
  useLayoutEffect,
  useEffect,
  useState,
  useRef,
  useMemo,
  memo,
  FC,
} from 'react';

import { createPortal } from 'react-dom';
import { DX_REMOVE_EVENT } from './component-base';
import { DXRemoveCustomArgs, TemplateWrapperProps } from './types';
import { RemovalLockerContext } from './contexts';

const createHiddenNode = (
  containerNodeName: string,
  ref: React.LegacyRef<any>,
  defaultElement: string,
) => {
  const style = { display: 'none' };
  switch (containerNodeName) {
    case 'TABLE':
      return <tbody style={style} ref={ref}></tbody>;
    case 'TBODY':
      return <tr style={style} ref={ref}></tr>;
    default:
      return React.createElement(defaultElement, { style, ref });
  }
};

const TemplateWrapperComponent: FC<TemplateWrapperProps> = ({
  templateFactory,
  data,
  index,
  container,
  onRemoved,
  onRendered,
}) => {
  const [removalListenerRequired, setRemovalListenerRequired] = useState(false);
  const isRemovalLocked = useRef(false);
  const removalLocker = useMemo(() => ({
    lock(): void { isRemovalLocked.current = true; },
    unlock(): void { isRemovalLocked.current = false; },
  }), []);

  const element = useRef<HTMLElement>();
  const hiddenNodeElement = useRef<HTMLElement>();
  const removalListenerElement = useRef<HTMLElement>();

  const onTemplateRemoved = useCallback((_, args: DXRemoveCustomArgs | undefined) => {
    if (args?.isUnmounting || isRemovalLocked.current) {
      return;
    }

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

    if (el && el.nodeType === Node.ELEMENT_NODE) {
      events.off(el, DX_REMOVE_EVENT, onTemplateRemoved);
      events.on(el, DX_REMOVE_EVENT, onTemplateRemoved);
    } else if (!removalListenerRequired) {
      setRemovalListenerRequired(true);
    } else if (removalListenerElement.current) {
      events.off(removalListenerElement.current, DX_REMOVE_EVENT, onTemplateRemoved);
      events.on(removalListenerElement.current, DX_REMOVE_EVENT, onTemplateRemoved);
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
    onRendered();
  }, [onRendered]);

  const hiddenNode = createHiddenNode(container?.nodeName, (node: HTMLElement) => {
    hiddenNodeElement.current = node;
    element.current = node?.previousSibling as HTMLElement;
  }, 'div');

  const removalListener = removalListenerRequired
    ? createHiddenNode(container?.nodeName, (node: HTMLElement) => { removalListenerElement.current = node; }, 'span')
    : undefined;

  return createPortal(
      <>
        <RemovalLockerContext.Provider value={removalLocker}>
          { templateFactory({ data, index, onRendered }) }
          { hiddenNode }
          { removalListener }
        </RemovalLockerContext.Provider>
      </>,
      container,
  );
};

export const TemplateWrapper = memo(TemplateWrapperComponent);
