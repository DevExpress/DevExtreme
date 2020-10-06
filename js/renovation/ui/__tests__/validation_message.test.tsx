/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { mount } from 'enzyme';
import DxValidationMessage from '../../../ui/validation_message';
import { viewFunction as ValidationMessageView, ValidationMessageProps, ValidationMessage } from '../validation_message';
import { DomComponentWrapper } from '../common/dom_component_wrapper';

jest.mock('../../../ui/validation_message', () => jest.fn());

describe('ValidationMessage', () => {
  it('View render', () => {
    const props = {
      props: new ValidationMessageProps(),
      restAttributes: { 'rest-attributes': 'true' },
    } as Partial<ValidationMessage>;
    const tree = mount(<ValidationMessageView {...props as any} /> as any);

    expect(tree.find(DomComponentWrapper).props()).toMatchObject({
      componentProps: props.props,
      componentType: DxValidationMessage,
      'rest-attributes': 'true',
    });
  });
});
