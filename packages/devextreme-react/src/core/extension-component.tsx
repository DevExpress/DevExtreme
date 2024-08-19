import * as React from 'react';

import {
  useImperativeHandle,
  forwardRef,
  useRef,
  useLayoutEffect,
  useCallback,
  ReactElement,
} from 'react';

import { IHtmlOptions, ComponentBaseRef, ComponentBase } from './component-base';
import { ComponentProps, NestedComponentMeta } from './component';

type NestedOptionElement = ReactElement<any, React.JSXElementConstructor<any> & NestedComponentMeta>;

function elementIsExtension(el: NestedOptionElement): boolean {
  return el.type?.componentType === 'extension';
}

const ExtensionComponent = forwardRef<ComponentBaseRef, any>(
  <P extends IHtmlOptions>(props: P & ComponentProps, ref: React.ForwardedRef<ComponentBaseRef>) => {
    const componentBaseRef = useRef<ComponentBaseRef>(null);

    const createWidget = useCallback((el?: Element) => {
      componentBaseRef.current?.createWidget(el);
    }, [componentBaseRef.current]);

    useLayoutEffect(() => {
      const { onMounted } = props as any;
      if (onMounted) {
        onMounted(createWidget);
      } else {
        createWidget();
      }
    }, []);

    useImperativeHandle(ref, () => (
      {
        getInstance() {
          return componentBaseRef.current?.getInstance();
        },
        getElement() {
          return componentBaseRef.current?.getElement();
        },
        createWidget(el) {
          createWidget(el);
        },
      }
    ), [componentBaseRef.current, createWidget]);

    return (
      <ComponentBase<P>
        ref={componentBaseRef}
        {...props}
      />
    );
  },
) as <P extends IHtmlOptions>(props: P & ComponentProps & { ref?: React.Ref<ComponentBaseRef> }) => ReactElement | null;

export {
  ExtensionComponent,
  elementIsExtension,
};
