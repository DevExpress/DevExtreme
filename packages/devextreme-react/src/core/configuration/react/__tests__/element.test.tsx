/* eslint-disable max-classes-per-file */
import { render } from '@testing-library/react';
import * as React from 'react';
import { memo } from 'react';
import ConfigurationComponent from '../../../nested-option';
import { Template } from '../../../template';

import {
  ElementType,
  getElementType,
  getOptionInfo,
  IElementDescriptor,
} from '../element';

const minimalComponentDescriptor: IElementDescriptor = {
  OptionName: 'option',
  IsCollectionItem: false,
};

let MinimalConfigurationComponent = memo(function MinimalConfigurationComponent(props: any) {
  return (
    <ConfigurationComponent<any>
      elementDescriptor={minimalComponentDescriptor}
      {...props}
    />
  );
}) as React.MemoExoticComponent<any> & { elementDescriptor: IElementDescriptor };

MinimalConfigurationComponent = Object.assign(MinimalConfigurationComponent, {
  elementDescriptor: minimalComponentDescriptor,
});

const richComponentDescriptor: IElementDescriptor = {
  OptionName: 'option',
  IsCollectionItem: false,
  DefaultsProps: { defaultValue: 'value' },
  TemplateProps: [{
    tmplOption: 'template',
    render: 'render',
    component: 'component',
  }],
  PredefinedProps: { type: 'numeric' },
};

let RichConfigurationComponent = memo(function RichConfigurationComponent(props: any) {
  return (
    <ConfigurationComponent<any>
      elementDescriptor={richComponentDescriptor}
      {...props}
    />
  );
}) as React.MemoExoticComponent<any> & { elementDescriptor: IElementDescriptor };

RichConfigurationComponent = Object.assign(RichConfigurationComponent, {
  elementDescriptor: richComponentDescriptor,
});

const collectionComponentDescriptor: IElementDescriptor = {
  OptionName: 'option',
  IsCollectionItem: true,
  DefaultsProps: { defaultValue: 'value' },
  TemplateProps: [{
    tmplOption: 'template',
    render: 'render',
    component: 'component',
  }],
  PredefinedProps: { type: 'numeric' },
};

let CollectionConfigurationComponent = memo(function CollectionConfigurationComponent(props: any) {
  return (
    <ConfigurationComponent<any>
      elementDescriptor={collectionComponentDescriptor}
      {...props}
    />
  );
}) as React.MemoExoticComponent<any> & { elementDescriptor: IElementDescriptor };

CollectionConfigurationComponent = Object.assign(CollectionConfigurationComponent, {
  elementDescriptor: collectionComponentDescriptor,
});

const configurationComponents: (React.MemoExoticComponent<any> & { elementDescriptor: IElementDescriptor })[] = [
  MinimalConfigurationComponent,
  RichConfigurationComponent,
  CollectionConfigurationComponent,
];

const otherComponents = [
  'div',
  ConfigurationComponent,
  () => React.createElement('div', {}, 'text'),
];

describe('getElementInfo', () => {
  configurationComponents.forEach((component) => {
    it('parses Configuration component', () => {
      const element = React.createElement(component);

      const elementInfo = getOptionInfo(
        component.elementDescriptor,
        element.props,
      );

      if (elementInfo.type !== ElementType.Option) {
        expect(elementInfo.type).toEqual(ElementType.Option);
        return;
      }

      expect(elementInfo.props).toEqual(element.props);

      const { descriptor } = elementInfo;
      expect(descriptor.name).toEqual(component.elementDescriptor.OptionName);
      expect(descriptor.isCollection).toEqual(component.elementDescriptor.IsCollectionItem);
      expect(descriptor.templates).toEqual(component.elementDescriptor.TemplateProps || []);
      expect(descriptor.initialValuesProps).toEqual(component.elementDescriptor.DefaultsProps || {});
      expect(descriptor.predefinedValuesProps).toEqual(component.elementDescriptor.PredefinedProps || {});
    });
  });

  it('parses Template component', () => {
    const element = React.createElement(
      Template,
      {
        name: 'template-name',
      },
      'Template content',
    );

    const elementType = getElementType(element);

    expect(elementType).toEqual(ElementType.Template);
  });

  otherComponents.forEach((component) => {
    it('parses Other components', () => {
      const element = React.createElement(component);

      render(React.createElement(component));
      const elementType = getElementType(element);

      expect(elementType).toEqual(ElementType.Unknown);
    });
  });
});
