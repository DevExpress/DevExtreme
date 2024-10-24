/* eslint-disable max-classes-per-file */
import { Component, ComponentRef, IHtmlOptions } from '../component';
import * as React from 'react';

import {
  memo,
  useImperativeHandle,
  useCallback,
  useContext,
  useRef,
  forwardRef,
  ReactElement,
} from 'react';

import { RestoreTreeContext } from '../contexts';

const eventHandlers: { [index: string]: ((e?: any) => void)[] } = {};

const Widget = {
  option: jest.fn(),
  resetOption: jest.fn(),
  beginUpdate: jest.fn(),
  endUpdate: jest.fn(),
  on: (event: string, handler: (e: any) => void): void => {
    if (eventHandlers[event]) {
      eventHandlers[event].push(handler);
    } else {
      eventHandlers[event] = [handler];
    }
  },
  off: (event: string, handler: (e: any) => void) => {
    eventHandlers[event] = eventHandlers[event].filter((e) => e !== handler);
  },
  clearExtensions: jest.fn(),
  dispose: jest.fn(),
  skipOptionsRollBack: false,
  focus: jest.fn(),
};

const WidgetClass = jest.fn<typeof Widget, any>(() => Widget);

interface TestComponentRef {
  instance: () => { element: () => HTMLDivElement | undefined };
  getProps: () => any;
}

const TestComponent = memo(forwardRef<TestComponentRef, any>(function TestComponent<P = any>(props: P, ref: React.ForwardedRef<TestComponentRef>) {
  const componentRef = useRef<ComponentRef>(null);

  const getElement = useCallback(() => {
    return componentRef.current!.getElement();
  }, []);

  const clearExtensions = useCallback(() => {
    Widget.clearExtensions();
  }, []);

  const beforeCreateWidget = useCallback(() => {
    eventHandlers.optionChanged = [];
    Widget.option.mockImplementation((name: string) => name === 'integrationOptions.useDeferUpdateForTemplates');
  }, []);

  const afterCreateWidget = useCallback(() => {
    Widget.option.mockReset();
    Widget.resetOption.mockReset();
  }, []);

  useImperativeHandle(ref, () => {
    return {
      instance() {
        return {
          element() {
            return getElement();
          }
        }
      },
      getProps() {
        return props;
      },
    };
  }, [componentRef.current, getElement, props]);

  return (
    <Component<P & IHtmlOptions>
      ref={componentRef}
      WidgetClass={WidgetClass}
      clearExtensions={clearExtensions}
      beforeCreateWidget={beforeCreateWidget}
      afterCreateWidget={afterCreateWidget}
      {...props}
    />
  );
})) as <P = any>(props: P, ref: React.ForwardedRef<ComponentRef>) => ReactElement<any> | null;

const TestPortalComponent = memo(forwardRef<TestComponentRef, any>(function TestPortalComponent<P = any>(props: P, ref: React.ForwardedRef<TestComponentRef>) {
  return (
    <TestComponent<P>
      ref={ref}
      isPortalComponent={true}
      {...props}
    />
  );
})) as <P = any>(props: P, ref: React.ForwardedRef<ComponentRef>) => ReactElement<any> | null;

const TestRestoreTreeComponent = forwardRef((_, ref: React.ForwardedRef<{ restoreTree?: () => void }>) => {
  const restoreParentLink = useContext(RestoreTreeContext);

  useImperativeHandle(ref, () => {
    return {
      restoreTree: restoreParentLink
    };
  }, [restoreParentLink]);

  return <div>Context Component</div>;
});

function fireOptionChange(fullName: string, value: unknown): void {
  eventHandlers.optionChanged?.forEach((e) => e({
    name: fullName.split('.')[0],
    fullName,
    value,
  }));
}

export {
  TestComponent,
  TestPortalComponent,
  TestRestoreTreeComponent,
  TestComponentRef,
  Widget,
  WidgetClass,
  eventHandlers,
  fireOptionChange,
};
