import React from 'react';
import { shallow, mount } from 'enzyme';
import { PlaceholderItem, viewFunction as PlaceholderItemView } from '../placeholder_item';

describe('PlaceholderItem', () => {
  describe('View', () => {
    it('should be empty if no currentComponent', () => {
      const placeholderItem: PlaceholderItem = {
        currentComponent: null,
        props: {
          index: 1,
        },
      } as any;

      const tree = mount(<PlaceholderItemView {...placeholderItem as any} />);
      expect(tree.html()).toEqual(null);
    });

    it('should render currentComponent', () => {
      const SomeComponent: any = () => {};

      const placeholderItem: PlaceholderItem = {
        currentComponent: () => <SomeComponent />,
        props: {
          index: 1,
        },
      } as any;

      const tree = shallow(<PlaceholderItemView {...placeholderItem as any} />);
      expect(tree.find(SomeComponent).length).toEqual(1);
    });
  });
});
