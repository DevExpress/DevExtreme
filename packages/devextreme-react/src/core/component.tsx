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

type ComponentProps = React.PropsWithChildren<{
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
}>;

type ComponentRef = ComponentBaseRef & {
  clearExtensions: () => void;
};

const Component = forwardRef<ComponentRef, any>(
  <P extends IHtmlOptions>(props: P & ComponentProps, ref: React.ForwardedRef<ComponentRef>) => {
    const componentBaseRef = useRef<ComponentBaseRef>(null);
    const extensionCreators = useRef<((element: Element) => void)[]>([]);

    const registerExtension = useCallback((creator: any) => {
      extensionCreators.current.push(creator);
    }, []);

    const createExtensions = useCallback(() => {
      extensionCreators.current.forEach((creator) => {
        creator(componentBaseRef.current?.getElement() as HTMLDivElement);
      });
    }, []);

    const renderChildren = useCallback(() => React.Children.map(
      props.children,
      (child) => {
        if (React.isValidElement(child) && elementIsExtension(child)) {
          return React.cloneElement(
            child,
            { onMounted: registerExtension },
          );
        }

        return child;
      },
    ), [props, registerExtension]);

    const createWidget = useCallback((el?: Element) => {
      return componentBaseRef.current?.createWidget(el) ?? false;
    }, []);

    const clearExtensions = useCallback(() => {
      props.clearExtensions?.();
      extensionCreators.current = [];
    }, [props.clearExtensions]);

    const createWidgetRef = useRef(createWidget);
    const clearExtensionsRef = useRef(clearExtensions);

    useLayoutEffect(() => {
      const created = createWidget();
      if (created) {
        createExtensions();
      }

      return () => {
        const el = componentBaseRef.current?.getElement();
        const clearedRef = { cleared: false };

        const checkAndClear = () => {
          if (clearedRef.cleared) return;

          // If still connected, it's likely Activity hide -> do nothing
          if (el && el.isConnected) return;

          clearedRef.cleared = true;
          clearExtensionsRef.current?.();
        };

        queueMicrotask(checkAndClear);
        setTimeout(checkAndClear, 0);
      };
    }, []);

    useLayoutEffect(() => {
      createWidgetRef.current = createWidget;
    }, [createWidget]);

    useLayoutEffect(() => {
      clearExtensionsRef.current = clearExtensions;
    }, [clearExtensions]);

    useImperativeHandle(ref, () => (
      {
        getInstance() {
          return componentBaseRef.current?.getInstance();
        },
        getElement() {
          return componentBaseRef.current?.getElement();
        },
        createWidget(el) {
          return createWidgetRef.current?.(el) ?? false;
        },
        clearExtensions() {
          clearExtensionsRef.current?.();
        },
      }
    ), []);

    return (
      <ComponentBase<P>
        ref={componentBaseRef}
        renderChildren={renderChildren}
        {...props}
      />
    );
  },
) as <P extends IHtmlOptions>(
  props: P & ComponentProps & { ref?: React.Ref<ComponentRef> },
) => ReactElement | null;

export {
  Component,
  ComponentProps,
  IHtmlOptions,
  IElementDescriptor,
  ComponentRef,
  NestedComponentMeta,
};
