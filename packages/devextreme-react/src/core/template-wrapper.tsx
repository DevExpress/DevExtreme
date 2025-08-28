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
      return <tbody style={style} ref={ref} />;
    case 'TBODY':
      return <tr style={style} ref={ref} />;
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
  componentKey,
}) => {
  const [removalListenerRequired, setRemovalListenerRequired] = useState(false);
  const isRemovalLocked = useRef(false);
  const removalLocker = useMemo(() => ({
    lock(): void { isRemovalLocked.current = true; },
    unlock(): void { isRemovalLocked.current = false; },
  }), []);

  const elements = useRef<HTMLElement[]>([]);
  const hiddenNodeElement = useRef<HTMLElement>();
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
        hiddenNodeElement.current,
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

  const containerContent = Array.from(container.childNodes);

  const hiddenNode = createHiddenNode(container?.nodeName, (node: HTMLElement) => {
    hiddenNodeElement.current = node;
    elements.current = [];

    let currentNode = node?.previousSibling as HTMLElement;

    while (currentNode) {
      if (!containerContent.includes(currentNode)) {
        elements.current.push(currentNode);
      }

      currentNode = currentNode?.previousSibling as HTMLElement;
    }
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
