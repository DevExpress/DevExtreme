import React from 'react';
import { shallow } from 'enzyme';
import { Form, viewFunction as FormView } from '../form';
import { FormProps } from '../form_props';
import { DomComponentWrapper } from '../../../common/dom_component_wrapper';
import LegacyForm from '../../../../../ui/form';
import { SimpleItem } from '../simple_item';
import { LabelProps } from '../label_props';
import { RequiredRule } from '../required_rule_props';
import { TextBoxProps } from '../text_box_props';

describe('Form', () => {
  describe('View', () => {
    it('default render', () => {
      const componentProps = new FormProps();
      componentProps.items = [new SimpleItem()];
      componentProps.items[0].label = new LabelProps();
      componentProps.items[0].editorOptions = new TextBoxProps();
      componentProps.items[0].validationRules = [new RequiredRule()];

      const props = {
        componentProps,
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
