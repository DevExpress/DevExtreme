import React from 'react';
import { mount } from 'enzyme';
import { ValueSetter, viewFunction as ValueSetterView } from '../value_setter';
import { createValue, Plugins } from '../context';

describe('ValueSetter', () => {
  const SomeValue = createValue();

  describe('View', () => {
    it('should be empty', () => {
      const valueSetter = new ValueSetter({
        type: SomeValue,
        value: 'text',
      });

      const tree = mount(<ValueSetterView {...valueSetter as any} />);
      expect(tree.html()).toEqual('<div></div>');
    });
  });

  describe('Effects', () => {
    describe('updateComponentTypes', () => {
      it('should subscribe to plugin', () => {
        const valueSetter = new ValueSetter({
          type: SomeValue,
          value: 'test',
        });
        valueSetter.plugins = new Plugins();

        valueSetter.updatePluginValue();

        expect(valueSetter.plugins.getValue(SomeValue)).toEqual('test');
      });
    });
  });
});
