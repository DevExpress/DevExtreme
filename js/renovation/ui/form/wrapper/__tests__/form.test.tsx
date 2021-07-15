import React from 'react';
import { shallow } from 'enzyme';
import { Form, viewFunction as FormView } from '../form';
import { FormProps } from '../form_props';
import { DomComponentWrapper } from '../../../common/dom_component_wrapper';
import LegacyForm from '../../../../../ui/form';
import { SimpleItem } from '../simple_item';
import { EmptyItem } from '../empty_item';
import { GroupItem } from '../group_item';
import { TabbedItem } from '../tabbed_item';

describe('Form', () => {
  describe('View', () => {
    it('default render', () => {
      const componentProps = new FormProps();
      componentProps.items = ['testField', new SimpleItem(), new EmptyItem(), new GroupItem(), new TabbedItem()];
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
