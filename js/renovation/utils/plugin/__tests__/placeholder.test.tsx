import React from 'react';
import { shallow } from 'enzyme';
import { Placeholder, viewFunction as PlaceholderView } from '../placeholder';
import { createPlaceholder, Plugins } from '../context';
import { PlaceholderItem } from '../placeholder_item';

describe('Placeholder', () => {
  const somePlaceholderPlugin = createPlaceholder();

  describe('View', () => {
    it('should be empty', () => {
      const placeholder = new Placeholder({
        type: somePlaceholderPlugin,
      });

      const tree = shallow(<PlaceholderView {...placeholder as any} />);
      expect(tree.find(PlaceholderItem).props()).toMatchObject({
        componentTypes: [],
      });
    });
  });

  describe('Effects', () => {
    describe('updateComponentTypes', () => {
      it('should subscribe to plugin', () => {
        const plugins = new Plugins();

        const placeholder = new Placeholder({
          type: somePlaceholderPlugin,
        });
        placeholder.plugins = plugins;

        placeholder.updateComponentTypes();
        plugins.set(somePlaceholderPlugin, [
          { component: 'component 1' },
          { component: 'component 2' },
        ] as any);

        expect(placeholder.componentTypes).toMatchObject([
          'component 2',
          'component 1',
        ]);
      });
    });
  });
});
