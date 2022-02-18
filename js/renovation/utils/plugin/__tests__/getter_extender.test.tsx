import React from 'react';
import { mount } from 'enzyme';
import { GetterExtender, viewFunction as GetterExtenderView } from '../getter_extender';
import { createGetter, createSelector, Plugins } from '../context';

describe('GetterExtender', () => {
  const SomeGetter = createGetter(1);
  const testSelector = createSelector([], () => 'test');

  describe('View', () => {
    it('should be empty', () => {
      const getterExtender = new GetterExtender({
        type: SomeGetter,
        order: 1,
        selector: testSelector,
      });

      const tree = mount(<GetterExtenderView {...getterExtender as any} />);
      expect(tree.html()).toEqual('<div></div>');
    });
  });

  describe('Effects', () => {
    describe('updateComponentTypes', () => {
      it('should subscribe to plugin', () => {
        const valueSetter = new GetterExtender({
          type: SomeGetter,
          order: 1,
          selector: testSelector,
        });
        valueSetter.plugins = new Plugins();
        valueSetter.updateExtender();

        expect(valueSetter.plugins.getValue(SomeGetter)).toEqual('test');
      });
    });
  });
});
