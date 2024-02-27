import * as React from 'react';

import {
  useImperativeHandle,
  forwardRef,
  useRef,
  useEffect,
  useCallback,
  ReactElement,
  memo,
} from 'react';

import { IHtmlOptions, ComponentBaseRef, ComponentBase } from './component-base-func';
import { IExpectedChild } from './configuration/react/element';
import { ITemplateMeta } from './template-func';
import { elementIsExtension } from './extension-component-func';

interface ComponentProps {
  widgetClass?: any;
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
};

type ComponentRef = ComponentBaseRef & {
  clearExtensions: () => void;
}

const Component = memo(forwardRef<ComponentRef, any>(function Component<P extends IHtmlOptions>(props: P & ComponentProps, ref: React.ForwardedRef<ComponentRef>) {
  const componentBaseRef = useRef<ComponentBaseRef>(null);
  const extensionCreators = useRef<((element: Element) => void)[]>([]);

  const registerExtension = useCallback((creator: any) => {
    extensionCreators.current.push(creator);
  }, []);

  const createExtensions = useCallback(() => {
    extensionCreators.current.forEach((creator) => creator(componentBaseRef.current!.getElement()));
  }, []);

  const renderChildren = useCallback(() => {
    return React.Children.map(
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
    );
  }, [props]);

  const createWidget = useCallback((el?: Element) => {
    componentBaseRef.current!.createWidget(el);
  }, [componentBaseRef.current]);

  const clearExtensions = useCallback(() => {
    if (props.clearExtensions) {
      props.clearExtensions();
    }

    extensionCreators.current = [];
  }, [extensionCreators.current]);

  useEffect(() => {
    createWidget();
    createExtensions();

    return () => {
      clearExtensions();
    };
  }, []);

  useImperativeHandle(ref, () => {
    return {
      getInstance() {
        return componentBaseRef.current!.getInstance();
      },
      getElement() {
        return componentBaseRef.current!.getElement();
      },
      createWidget(el) {
        createWidget(el);
      },
      clearExtensions() {
        clearExtensions();
      }
    };
  });

  return (
    <ComponentBase<P>
      ref={componentBaseRef}
      renderChildren={renderChildren}
      {...props}
    />
  );
})) as <P extends IHtmlOptions>(props: P & ComponentProps, ref: React.ForwardedRef<ComponentRef>) => ReactElement<any> | null;

export {
  Component,
  ComponentProps,
  ComponentRef,
  IHtmlOptions,
};