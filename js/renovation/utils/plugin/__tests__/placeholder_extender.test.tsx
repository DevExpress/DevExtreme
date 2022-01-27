import React from 'react';
import { mount } from 'enzyme';
import { PlaceholderExtender, viewFunction as PlaceholderExtenderView } from '../placeholder_extender';
import { Plugins } from '../context';

describe('PlaceholderExtender', () => {
  describe('View', () => {
    it('should be empty', () => {
      const tree = mount(<PlaceholderExtenderView />);
      expect(tree.html()).toEqual('<div></div>');
    });
  });

  describe('Effects', () => {
    describe('extendPlaceholder', () => {
      it('should call plugins.extendPlaceholder', () => {
        const mock = jest.fn();

        const plugins: Plugins = {
          extendPlaceholder: mock,
        } as any;

        const placeholderExtender = new PlaceholderExtender({} as any);
        placeholderExtender.plugins = plugins;
        placeholderExtender.extendPlaceholder();

        expect(mock).toBeCalled();
      });
    });
  });
});
