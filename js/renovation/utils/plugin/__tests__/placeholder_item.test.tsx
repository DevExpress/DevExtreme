import React from 'react';
import { shallow, mount } from 'enzyme';
import { PlaceholderItem, PlaceholderItemProps, viewFunction as PlaceholderItemView } from '../placeholder_item';
import { createValue, Plugins } from '../context';

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

    it('should pass args to currentComponent', () => {
      const SomeComponent: any = () => {};

      const placeholderItem: PlaceholderItem = {
        currentComponent: (args) => <SomeComponent args={args} />,
        args: [1, 2],
        props: {
          index: 0,
        },
      } as any;

      const tree = shallow(<PlaceholderItemView {...placeholderItem as any} />);
      expect(tree.find(SomeComponent).length).toEqual(1);
      expect(tree.find(SomeComponent).props()).toMatchObject({
        args: [1, 2],
      });
    });
  });

  describe('Getters', () => {
    it('currentComponent returns component from componentTypes by index', () => {
      const SomeComponent: any = () => {};
      const componentTypes = [() => <SomeComponent />];
      const props = {
        componentTypes,
        componentDeps: [],
        index: 0,
      } as Partial<PlaceholderItemProps>;

      const placeholderItem = new PlaceholderItem(props);
      placeholderItem.plugins = new Plugins();

      expect(placeholderItem.currentComponent).toEqual(componentTypes[0]);
    });

    it('currentComponent returns undefined for next index', () => {
      const SomeComponent: any = () => {};
      const componentTypes = [() => <SomeComponent />];
      const props = {
        componentTypes,
        componentDeps: [],
        index: 1,
      } as Partial<PlaceholderItemProps>;

      const placeholderItem = new PlaceholderItem(props);
      placeholderItem.plugins = new Plugins();

      expect(placeholderItem.currentComponent).toBeUndefined();
    });

    it('currentComponent returns null if deps do not have values', () => {
      const SomeComponent: any = () => {};
      const componentTypes = [() => <SomeComponent />];
      const SomeValue1 = createValue();

      const props = {
        componentTypes,
        componentDeps: [[SomeValue1]],
        index: 0,
      } as Partial<PlaceholderItemProps>;

      const placeholderItem = new PlaceholderItem(props);
      placeholderItem.plugins = new Plugins();

      expect(placeholderItem.currentComponent).toBeNull();
    });

    it('currentComponent returns component if deps have values', () => {
      const SomeComponent: any = () => {};
      const componentTypes = [() => <SomeComponent />];
      const SomeValue = createValue();

      const props = {
        componentTypes,
        componentDeps: [[SomeValue]],
        index: 0,
      } as Partial<PlaceholderItemProps>;

      const placeholderItem = new PlaceholderItem(props);
      placeholderItem.plugins = new Plugins();
      placeholderItem.plugins.set(SomeValue, 1);

      expect(placeholderItem.currentComponent).toEqual(componentTypes[0]);
    });

    it('args returns values for componentDeps', () => {
      const SomeComponent: any = () => {};
      const componentTypes = [() => <SomeComponent />];
      const SomeValue = createValue();

      const props = {
        componentTypes,
        componentDeps: [[SomeValue]],
        index: 0,
      } as Partial<PlaceholderItemProps>;

      const placeholderItem = new PlaceholderItem(props);
      placeholderItem.plugins = new Plugins();
      placeholderItem.plugins.set(SomeValue, 1);

      expect(placeholderItem.args).toEqual([1]);
    });
  });

  describe('Effects', () => {
    it('updateArgs should increment updateCount to force render', () => {
      const SomeComponent: any = () => {};
      const SomeValue1 = createValue();
      const SomeValue2 = createValue();

      const props = {
        componentTypes: [(values) => <SomeComponent values={values} />],
        componentDeps: [[SomeValue1, SomeValue2]],
        index: 0,
      } as Partial<PlaceholderItemProps>;

      const placeholderItem = new PlaceholderItem(props);
      placeholderItem.plugins = new Plugins();

      placeholderItem.updateArgs();

      placeholderItem.plugins.set(SomeValue1, 1);
      placeholderItem.plugins.set(SomeValue2, 2);

      expect(placeholderItem.updateCounter).toEqual(2);
    });

    it('updateArgs should not increment updateCount after dispose', () => {
      const SomeComponent: any = () => {};
      const SomeValue1 = createValue();

      const props = {
        componentTypes: [(values) => <SomeComponent values={values} />],
        componentDeps: [[SomeValue1]],
        index: 0,
      } as Partial<PlaceholderItemProps>;

      const placeholderItem = new PlaceholderItem(props);
      placeholderItem.plugins = new Plugins();

      const dispose = placeholderItem.updateArgs();

      dispose();

      placeholderItem.plugins.set(SomeValue1, 1);

      expect(placeholderItem.updateCounter).toEqual(0);
    });
  });
});
