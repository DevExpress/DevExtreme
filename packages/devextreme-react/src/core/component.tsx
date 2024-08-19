import * as React from 'react';

import {
  useImperativeHandle,
  forwardRef,
  useRef,
  useLayoutEffect,
  useCallback,
  ReactElement,
} from 'react';

import type { NestedComponentMeta } from './types';

import { IHtmlOptions, ComponentBaseRef, ComponentBase } from './component-base';
import { IElementDescriptor, IExpectedChild } from './configuration/react/element';
import { ITemplateMeta } from './template';
import { elementIsExtension } from './extension-component';

interface ComponentProps {
  WidgetClass?: any;
  isPortalComponent?: boolean;
  defaults?: Record<string, string>;
  templateProps?: ITemplateMeta[];
  expectedChildren?: Record<string, IExpectedChild>;
  subscribableOptions?: string[];
  independentEvents?: string[];
  useRequestAnimationFrameFlag?: boolean;
  clearExtensions?: () => void;
  beforeCreateWidget?: (element?: Element) => void;
  afterCreateWidget?: (element?: Element) => void;
}

type ComponentRef = ComponentBaseRef & {
  clearExtensions: () => void;
};

const Component = forwardRef<ComponentRef, any>(
  <P extends IHtmlOptions>(props: P & ComponentProps, ref: React.ForwardedRef<ComponentRef>) => {
    const componentBaseRef = useRef<ComponentBaseRef>(null);
    const extensionCreators = useRef<((element: Element) => void)[]>([]);

    const registerExtension = useCallback((creator: any) => {
      extensionCreators.current.push(creator);
    }, [extensionCreators.current]);

    const createExtensions = useCallback(() => {
      extensionCreators.current.forEach((creator) => creator(componentBaseRef.current?.getElement() as HTMLDivElement));
    }, [extensionCreators.current, componentBaseRef.current]);

    const renderChildren = useCallback(() => React.Children.map(
      // @ts-expect-error TS2339
      props.children,
      (child) => {
        if (child && elementIsExtension(child)) {
          return React.cloneElement(
            child,
            { onMounted: registerExtension },
          );
        }

        return child;
      },
    ), [props, registerExtension]);

    const createWidget = useCallback((el?: Element) => {
      componentBaseRef.current?.createWidget(el);
    }, [componentBaseRef.current]);

    const clearExtensions = useCallback(() => {
      if (props.clearExtensions) {
        props.clearExtensions();
      }

      extensionCreators.current = [];
    }, [
      extensionCreators.current,
      props.clearExtensions,
    ]);

    useLayoutEffect(() => {
      createWidget();
      createExtensions();

      return () => {
        clearExtensions();
      };
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
        clearExtensions() {
          clearExtensions();
        },
      }
    ), [componentBaseRef.current, createWidget, clearExtensions]);

    return (
      <ComponentBase<P>
        ref={componentBaseRef}
        renderChildren={renderChildren}
        {...props}
      />
    );
  },
) as <P extends IHtmlOptions>(props: P & ComponentProps & { ref?: React.Ref<ComponentRef> }) => ReactElement | null;

export {
  Component,
  ComponentProps,
  IHtmlOptions,
  IElementDescriptor,
  ComponentRef,
  NestedComponentMeta,
};
