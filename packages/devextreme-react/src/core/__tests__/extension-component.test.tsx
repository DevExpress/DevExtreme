/* eslint-disable max-classes-per-file */
import { render, cleanup } from '@testing-library/react';
import * as React from 'react';
import { memo } from 'react';
import { ExtensionComponent } from '../extension-component';
import ConfigurationComponent from '../nested-option';
import {
  TestComponent,
  Widget,
  WidgetClass,
} from './test-component';
import { IHtmlOptions } from '../component-base';
import { NestedComponentMeta } from '../types';

const ExtensionWidgetClass = jest.fn<typeof Widget, any[]>(() => Widget);

const TestExtensionComponent = memo(function TestExtensionComponent(props: any) {
  return (
    <ExtensionComponent<IHtmlOptions>
      WidgetClass={ExtensionWidgetClass}
      {...props}
    />
  );
}) as React.MemoExoticComponent<any> & NestedComponentMeta;

TestExtensionComponent.componentType = 'extension';

afterEach(() => {
  WidgetClass.mockClear();
  ExtensionWidgetClass.mockClear();
  cleanup();
});

const NestedComponent = memo(function NestedComponent(props: any) {
  return (
    <ConfigurationComponent<{ a: number }>
      elementDescriptor={{
        OptionName: 'option1'
      }}
      {...props}
    />
  );
}) as React.MemoExoticComponent<any> & NestedComponentMeta;

NestedComponent.componentType = 'option';

it('is initialized as a plugin-component', () => {
  const onMounted = jest.fn();
  render(
    <TestExtensionComponent onMounted={onMounted} />,
  );

  expect(onMounted).toHaveBeenCalledTimes(1);
  expect(onMounted.mock.calls[0][0]).toBeInstanceOf(Function);
  expect(ExtensionWidgetClass).toHaveBeenCalledTimes(0);
});

it('is initialized as a standalone widget', () => {
  render(
    <TestExtensionComponent />,
  );

  expect(ExtensionWidgetClass).toHaveBeenCalledTimes(1);
});

it('creates widget on componentDidMount inside another component on same element', () => {
  render(
    <TestComponent>
      <TestExtensionComponent />
    </TestComponent>,
  );

  expect(ExtensionWidgetClass).toHaveBeenCalledTimes(1);
  expect(ExtensionWidgetClass.mock.calls[0][0]).toBe(WidgetClass.mock.calls[0][0]);
});

it('unmounts without errors', () => {
  const component = render(
    <TestExtensionComponent />,
  );

  expect(() => component.unmount.bind(component)).not.toThrow();
});

it('pulls options from a single nested component', () => {
  render(
    <TestComponent>
      <TestExtensionComponent>
        <NestedComponent a={123} />
      </TestExtensionComponent>
    </TestComponent>,
  );

  const options = ExtensionWidgetClass.mock.calls[0][1];

  expect(options).toHaveProperty('option1');
  expect(options.option1).toMatchObject({
    a: 123,
  });
});
