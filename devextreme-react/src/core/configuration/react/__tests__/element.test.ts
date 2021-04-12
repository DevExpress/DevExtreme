/* eslint-disable max-classes-per-file */
import { render } from '@testing-library/react';
import * as React from 'react';
import ConfigurationComponent from '../../../nested-option';
import { Template } from '../../../template';

import {
  ElementType,
  getElementInfo
} from '../element';

class MinimalConfigurationComponent extends ConfigurationComponent<any> {
  public static OptionName = 'option';

  public static IsCollectionItem = false;
}

class RichConfigurationComponent extends ConfigurationComponent<any> {
  public static OptionName = 'option';

  public static IsCollectionItem = false;

  public static DefaultsProps = { defaultValue: 'value' };

  public static TemplateProps = [{
    tmplOption: 'template',
    render: 'render',
    component: 'component',
    keyFn: 'keyFn',
  }];

  public static PredefinedProps = { type: 'numeric' };
}

class CollectionConfigurationComponent extends ConfigurationComponent<any> {
  public static OptionName = 'option';

  public static IsCollectionItem = true;

  public static DefaultsProps = { defaultValue: 'value' };

  public static TemplateProps = [{
    tmplOption: 'template',
    render: 'render',
    component: 'component',
    keyFn: 'keyFn',
  }];

  public static PredefinedProps = { type: 'numeric' };
}

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
      const element = React.createElement(component)

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
    )

    const elementInfo = getElementInfo(element);

    if (elementInfo?.type !== ElementType.Template) {
      expect(elementInfo).toEqual(ElementType.Template);
      return;
    }

    expect(elementInfo.props).toEqual(element.props);
  });

  otherComponents.forEach((component) => {
    it('parses Other components', () => {
      const element = React.createElement(component)

      render(React.createElement(component));
      const elementInfo = getElementInfo(element);

      expect(elementInfo.type).toEqual(ElementType.Unknown);
    });
  });
});
