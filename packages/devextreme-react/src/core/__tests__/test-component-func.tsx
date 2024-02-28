/* eslint-disable max-classes-per-file */
import { Component, ComponentRef, IHtmlOptions } from '../component-func';
import * as React from 'react';

import {
  memo,
  useImperativeHandle,
  useCallback,
  useRef,
  forwardRef,
  ReactElement,
} from 'react';

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
};

const WidgetClass = jest.fn<typeof Widget, any>(() => Widget);

const TestComponent = memo(forwardRef<ComponentRef, any>(function TestComponent<P = any>(props: P, ref: React.ForwardedRef<ComponentRef>) {
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
  }, []);

  useImperativeHandle(ref, () => {
    return {
      getInstance() {
        return componentRef.current!.getInstance();
      },
      getElement() {
        return getElement();
      },
      createWidget(el) {
        componentRef.current!.createWidget(el);
      },
      clearExtensions() {
        componentRef.current!.clearExtensions();
      },
      getProps() {
        return props;
      }
    };
  });

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

const TestPortalComponent = memo(forwardRef<ComponentRef, any>(function TestPortalComponent<P = any>(props: P, ref: React.ForwardedRef<ComponentRef>) {
  return (
    <TestComponent<P>
      ref={ref}
      isPortalComponent={true}
      {...props}
    />
  );
})) as <P = any>(props: P, ref: React.ForwardedRef<ComponentRef>) => ReactElement<any> | null;

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
  Widget,
  WidgetClass,
  eventHandlers,
  fireOptionChange,
};
