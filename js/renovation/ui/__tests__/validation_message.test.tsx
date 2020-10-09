/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { shallow } from 'enzyme';
import LegacyValidationMessage from '../../../ui/validation_message';
import { viewFunction as ValidationMessageView, ValidationMessageProps, ValidationMessage } from '../validation_message';
import { DomComponentWrapper } from '../common/dom_component_wrapper';

jest.mock('../../../ui/validation_message', () => jest.fn());

describe('ValidationMessage', () => {
  it('View render', () => {
    const rootElementRef = { } as HTMLDivElement;
    const componentProps = new ValidationMessageProps();
    const props = {
      props: { ...componentProps, rootElementRef },
      restAttributes: { 'rest-attributes': 'true' },
    } as Partial<ValidationMessage>;
    const tree = shallow(<ValidationMessageView {...props as any} />);

    expect(tree.find(DomComponentWrapper).props()).toMatchObject({
      rootElementRef: {},
      componentProps,
      componentType: LegacyValidationMessage,
      'rest-attributes': 'true',
    });
  });
});
