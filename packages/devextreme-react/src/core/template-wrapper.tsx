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

const GUARD_NODE_CLASS_NAME = '__dx_react_guard_node__';

const createHiddenNode = (
  containerNodeName: string,
  ref: React.LegacyRef<any>,
  defaultElement: string,
  className = '',
) => {
  const style = { display: 'none' };
  switch (containerNodeName) {
    case 'TABLE':
      return <tbody style={style} ref={ref} className={className} />;
    case 'TBODY':
      return <tr style={style} ref={ref} className={className} />;
    default:
      return React.createElement(defaultElement, { style, ref, className });
  }
};

const TemplateWrapperComponent: FC<TemplateWrapperProps> = ({
  templateFactory,
  data,
  index,
  container,
  onRemoved,
  onRendered,
  componentKey,
}) => {
  const [removalListenerRequired, setRemovalListenerRequired] = useState(false);
  const isRemovalLocked = useRef(false);
  const removalLocker = useMemo(() => ({
    lock(): void { isRemovalLocked.current = true; },
    unlock(): void { isRemovalLocked.current = false; },
  }), []);

  const elements = useRef<HTMLElement[]>([]);
  const guardElement = useRef<HTMLElement>();
  const removalListenerElement = useRef<HTMLElement>();

  const onTemplateRemoved = useCallback((_, args: DXRemoveCustomArgs | undefined) => {
    if (args?.isUnmounting || isRemovalLocked.current) {
      return;
    }

    [
      ...elements.current,
      removalListenerElement.current,
    ].forEach((el) => el && events.off(el, DX_REMOVE_EVENT, onTemplateRemoved));

    // In case of multiple root elements, letting the widget remove them all sync
    Promise.resolve().then(() => {
      onRemoved(componentKey);
    });
  }, [onRemoved]);

  useLayoutEffect(() => {
    const elementNodes = elements.current.filter((el) => el.nodeType === Node.ELEMENT_NODE);

    if (elementNodes.length) {
      elementNodes.forEach((el) => {
        events.off(el, DX_REMOVE_EVENT, onTemplateRemoved);
        events.on(el, DX_REMOVE_EVENT, onTemplateRemoved);
      });
    } else if (!removalListenerRequired) {
      setRemovalListenerRequired(true);
    } else if (removalListenerElement.current) {
      events.off(removalListenerElement.current, DX_REMOVE_EVENT, onTemplateRemoved);
      events.on(removalListenerElement.current, DX_REMOVE_EVENT, onTemplateRemoved);
    }

    return () => {
      const safeAppend = (child: HTMLElement | undefined) => {
        if (child && container && !container.contains(child)) {
          container.appendChild(child);
        }
      };

      [
        ...elements.current,
        guardElement.current,
        removalListenerElement.current,
      ].forEach((el) => safeAppend(el));

      if (elementNodes.length) {
        elementNodes.forEach((el) => events.off(el, DX_REMOVE_EVENT, onTemplateRemoved));
      }
    };
  }, [onTemplateRemoved, removalListenerRequired, container]);

  useEffect(() => {
    onRendered();
  }, [onRendered]);

  const guardNode = createHiddenNode(container?.nodeName, (node: HTMLElement) => {
    guardElement.current = node;
    elements.current = [];

    let currentNode = node?.previousSibling as HTMLElement;

    while (
      currentNode && (
        typeof currentNode.className !== 'string'
        || !currentNode.className.includes(GUARD_NODE_CLASS_NAME)
      )
    ) {
      elements.current.push(currentNode);
      currentNode = currentNode?.previousSibling as HTMLElement;
    }
  }, 'div', GUARD_NODE_CLASS_NAME);

  const removalListener = removalListenerRequired
    ? createHiddenNode(container?.nodeName, (node: HTMLElement) => { removalListenerElement.current = node; }, 'span')
    : undefined;

  return createPortal(
      <>
        <RemovalLockerContext.Provider value={removalLocker}>
          { templateFactory({ data, index, onRendered }) }
          { guardNode }
          { removalListener }
        </RemovalLockerContext.Provider>
      </>,
      container,
  );
};

export const TemplateWrapper = memo(TemplateWrapperComponent);
