import React from 'react';
import { mount } from 'enzyme';
import { GetterExtender, viewFunction as GetterExtenderView } from '../getter_extender';
import { createGetter, Plugins } from '../context';

describe('GetterExtender', () => {
  const SomeGetter = createGetter(1);

  describe('View', () => {
    it('should be empty', () => {
      const getterExtender = new GetterExtender({
        type: SomeGetter,
        order: 1,
        func: () => null,
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
          func: () => 'test',
        });
        valueSetter.plugins = new Plugins();

        valueSetter.updateExtender();

        expect(valueSetter.plugins.getValue(SomeGetter)).toEqual('test');
      });
    });
  });
});
