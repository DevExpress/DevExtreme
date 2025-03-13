import * as React from 'react';
import * as events from 'devextreme/events';
import {
  useCallback,
  useInsertionEffect,
  useEffect,
  useRef,
  useMemo,
  memo,
  FC, LegacyRef,
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
    case 'TABLE': return <tbody style={style} ref={ref} />;
    case 'TBODY': return <tr style={style} ref={ref} />;
    default: return React.createElement(defaultElement, { style, ref });
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
  const isRemovalLocked = useRef(false);
  const removalLocker = useMemo(() => ({
    lock: () => { isRemovalLocked.current = true; },
    unlock: () => { isRemovalLocked.current = false; },
  }), []);

  const templateRef = useRef<HTMLElement>(null);
  const removalListenerRef = useRef<HTMLElement>(null);

  const onTemplateRemoved = useCallback((_: unknown, args?: DXRemoveCustomArgs) => {
    if (args?.isUnmounting || isRemovalLocked.current) return;

    [templateRef, removalListenerRef].forEach((ref) => {
      const node = ref.current;
      if (node?.isConnected) events.off(node, DX_REMOVE_EVENT, onTemplateRemoved);
    });

    onRemoved();
  }, [onRemoved, templateRef.current, removalListenerRef.current]);

  useInsertionEffect(() => {
    const nodes = [templateRef.current, removalListenerRef.current];

    nodes.forEach((node) => {
      if (node?.isConnected) {
        events.on(node, DX_REMOVE_EVENT, onTemplateRemoved);
      }
    });

    return () => {
      nodes.forEach((node) => {
        if (node?.isConnected) {
          events.off(node, DX_REMOVE_EVENT, onTemplateRemoved);
        }
      });
    };
  }, [onTemplateRemoved]);

  useEffect(() => {
    onRendered();
    return () => {
      if (templateRef.current?.isConnected) {
        container?.appendChild(templateRef.current);
      }
    };
  }, [onRendered, templateRef.current]);

  if (!container?.isConnected) return null;

  return createPortal(
      <RemovalLockerContext.Provider value={removalLocker}>
        <div ref={templateRef as LegacyRef<HTMLDivElement> | undefined}>
          {templateFactory({ data, index, onRendered })}
        </div>

        {createHiddenNode(
          container.nodeName,
          removalListenerRef,
          'div',
        )}
      </RemovalLockerContext.Provider>,
        container,
  );
};

export const TemplateWrapper = memo(TemplateWrapperComponent);
