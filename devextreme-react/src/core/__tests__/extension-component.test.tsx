/* eslint-disable max-classes-per-file */
import { ExtensionComponent } from '../extension-component';
import ConfigurationComponent from '../nested-option';
import { render, cleanup } from '@testing-library/react';
import * as React from 'react';
import {
  TestComponent,
  Widget,
  WidgetClass
} from './test-component';

const ExtensionWidgetClass = jest.fn(() => Widget);

class TestExtensionComponent<P = any> extends ExtensionComponent<P> {
  constructor(props: P) {
    super(props);

    this._WidgetClass = ExtensionWidgetClass;
  }
}


afterEach(() => {
  WidgetClass.mockClear();
  ExtensionWidgetClass.mockClear();
  cleanup();
})

class NestedComponent extends ConfigurationComponent<{ a: number }> {
  public static OptionName = 'option1';
}

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
