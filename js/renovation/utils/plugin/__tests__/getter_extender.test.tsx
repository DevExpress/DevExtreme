import React from 'react';
import { mount } from 'enzyme';
import { GetterExtender, viewFunction as GetterExtenderView } from '../getter_extender';
import {
  createGetter, createSelector, createValue, Plugins,
} from '../context';

describe('GetterExtender', () => {
  const SomeGetter = createGetter(1);
  const testSelector = createSelector([], () => 'test');

  describe('View', () => {
    it('should be empty', () => {
      const getterExtender = new GetterExtender({
        type: SomeGetter,
        order: 1,
        value: testSelector,
      });

      const tree = mount(<GetterExtenderView {...getterExtender as any} />);
      expect(tree.html()).toEqual('<div></div>');
    });
  });

  describe('Effects', () => {
    describe('updateComponentTypes', () => {
      it('should subscribe to selector plugin', () => {
        const valueSetter = new GetterExtender({
          type: SomeGetter,
          order: 1,
          value: testSelector,
        });
        valueSetter.plugins = new Plugins();
        valueSetter.updateExtender();

        expect(valueSetter.plugins.getValue(SomeGetter)).toEqual('test');
      });

      it('should subscribe to value plugin', () => {
        const SomeValue = createValue();
        const valueSetter = new GetterExtender({
          type: SomeGetter,
          order: 1,
          value: SomeValue,
        });
        valueSetter.plugins = new Plugins();
        valueSetter.plugins.set(SomeValue, 'test');
        valueSetter.updateExtender();

        expect(valueSetter.plugins.getValue(SomeGetter)).toEqual('test');
      });
    });
  });
});
