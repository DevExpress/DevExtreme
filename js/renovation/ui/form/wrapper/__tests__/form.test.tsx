import React from 'react';
import { shallow } from 'enzyme';
import { Form, viewFunction as FormView } from '../form';
import { FormProps } from '../form_props';
import { DomComponentWrapper } from '../../../common/dom_component_wrapper';
import LegacyForm from '../../../../../ui/toolbar';

describe('Toolbar', () => {
  describe('View', () => {
    it('default render', () => {
      const componentProps = new FormProps();
      const props = {
        props: componentProps,
        restAttributes: { 'rest-attributes': 'true' },
      } as Partial<Form>;
      const tree = shallow(<FormView {...props as any} /> as any);

      expect(tree.find(DomComponentWrapper).props()).toMatchObject({
        componentProps,
        componentType: LegacyForm,
        'rest-attributes': 'true',
      });
    });
  });
});
