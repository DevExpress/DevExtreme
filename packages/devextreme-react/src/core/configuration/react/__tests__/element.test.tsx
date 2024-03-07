/* eslint-disable max-classes-per-file */
import { render } from '@testing-library/react';
import * as React from 'react';
import { memo } from 'react';
import ConfigurationComponent from '../../../nested-option';
import { Template } from '../../../template';

import {
  ElementType,
  IElementDescriptor,
  getElementInfo,
} from '../element';

const MinimalConfigurationComponent = memo(function MinimalConfigurationComponent(props: any) {
  return (
    <ConfigurationComponent<any>
      {...props}
    />
  );
}) as React.MemoExoticComponent<any> & IElementDescriptor;

MinimalConfigurationComponent.OptionName = 'option';
MinimalConfigurationComponent.IsCollectionItem = false;

const RichConfigurationComponent = memo(function RichConfigurationComponent(props: any) {
  return (
    <ConfigurationComponent<any>
      {...props}
    />
  );
}) as React.MemoExoticComponent<any> & IElementDescriptor;

RichConfigurationComponent.OptionName = 'option';
RichConfigurationComponent.IsCollectionItem = false;
RichConfigurationComponent.DefaultsProps = { defaultValue: 'value' };
RichConfigurationComponent.TemplateProps = [{
  tmplOption: 'template',
  render: 'render',
  component: 'component',
}];
RichConfigurationComponent.PredefinedProps = { type: 'numeric' };

const CollectionConfigurationComponent = memo(function CollectionConfigurationComponent(props: any) {
  return (
    <ConfigurationComponent<any>
      {...props}
    />
  );
}) as React.MemoExoticComponent<any> & IElementDescriptor;

CollectionConfigurationComponent.OptionName = 'option';
CollectionConfigurationComponent.IsCollectionItem = true;
CollectionConfigurationComponent.DefaultsProps = { defaultValue: 'value' };
CollectionConfigurationComponent.TemplateProps = [{
  tmplOption: 'template',
  render: 'render',
  component: 'component',
}];
CollectionConfigurationComponent.PredefinedProps = { type: 'numeric' };

const configurationComponents: any[] = [
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

      const elementInfo = getElementInfo(element);

      if (elementInfo.type !== ElementType.Option) {
        expect(elementInfo.type).toEqual(ElementType.Option);
        return;
      }

      expect(elementInfo.props).toEqual(element.props);

      const { descriptor } = elementInfo;
      expect(descriptor.name).toEqual(component.OptionName);
      expect(descriptor.isCollection).toEqual(component.IsCollectionItem);
      expect(descriptor.templates).toEqual(component.TemplateProps || []);
      expect(descriptor.initialValuesProps).toEqual(component.DefaultsProps || {});
      expect(descriptor.predefinedValuesProps).toEqual(component.PredefinedProps || {});
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

    const elementInfo = getElementInfo(element);

    if (elementInfo?.type !== ElementType.Template) {
      expect(elementInfo).toEqual(ElementType.Template);
      return;
    }

    expect(elementInfo.props).toEqual(element.props);
  });

  otherComponents.forEach((component) => {
    it('parses Other components', () => {
      const element = React.createElement(component);

      render(React.createElement(component));
      const elementInfo = getElementInfo(element);

      expect(elementInfo.type).toEqual(ElementType.Unknown);
    });
  });
});
