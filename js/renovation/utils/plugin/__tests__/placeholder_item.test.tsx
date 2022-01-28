import React from 'react';
import { mount } from 'enzyme';
import { Fragment } from '@devextreme-generator/declarations';
import { PlaceholderItem, viewFunction as PlaceholderItemView } from '../placeholder_item';
import { createValue, Plugins } from '../context';

describe('PlaceholderItem', () => {
  describe('View', () => {
    it('should be empty if no currentTemplate', () => {
      const placeholderItem: PlaceholderItem = {
        currentTemplate: null,
        props: {
          index: 1,
        },
      } as any;

      const tree = mount(<PlaceholderItemView {...placeholderItem as any} />);
      expect(tree.html()).toEqual(null);
    });

    it('should render currentTemplate', () => {
      const SomeComponent: any = () => <Fragment />;

      const placeholderItem: PlaceholderItem = {
        currentTemplate: () => <SomeComponent />,
        props: {
          index: 1,
        },
      } as any;

      const tree = mount(<PlaceholderItemView {...placeholderItem as any} />);
      expect(tree.find(SomeComponent).length).toEqual(1);
    });

    it('should pass args to currentTemplate', () => {
      const SomeComponent: any = () => <Fragment />;
      const placeholderItem: PlaceholderItem = {
        currentTemplate: ({ deps }) => <SomeComponent args={deps} />,
        args: [1, 2],
        props: {
          index: 0,
        },
      } as any;

      const tree = mount(<PlaceholderItemView {...placeholderItem as any} />);
      expect(tree.find(SomeComponent).length).toEqual(1);
      expect(tree.find(SomeComponent).props()).toMatchObject({
        args: [1, 2],
      });
    });

    it('should pass baseTemplate to currentTemplate', () => {
      const SomeComponent: any = () => <Fragment />;
      const currentTemplate = ({ baseTemplate: BaseTemplate }) => <BaseTemplate />;
      const placeholderItem: PlaceholderItem = {
        currentTemplate,
        args: [],
        props: {
          index: 0,
          componentTypes: [currentTemplate, SomeComponent],
          componentDeps: [[], []],
        },
      } as any;
      const tree = mount(<PlaceholderItemView {...placeholderItem as any} />);
      expect(tree.find(SomeComponent).length).toEqual(1);
    });
  });

  describe('Getters', () => {
    it('currentTemplate returns component from componentTypes by index', () => {
      const SomeComponent: any = () => {};
      const componentTypes = [() => <SomeComponent />];
      const props = {
        componentTypes,
        componentDeps: [],
        index: 0,
        plugins: new Plugins(),
      };

      const placeholderItem = new PlaceholderItem(props);

      expect(placeholderItem.currentTemplate).toEqual(componentTypes[0]);
    });

    it('currentTemplate returns undefined for next index', () => {
      const SomeComponent: any = () => {};
      const componentTypes = [() => <SomeComponent />];
      const props = {
        componentTypes,
        componentDeps: [],
        index: 1,
        plugins: new Plugins(),
      };

      const placeholderItem = new PlaceholderItem(props);

      expect(placeholderItem.currentTemplate).toBeUndefined();
    });

    it('currentTemplate returns null if deps do not have values', () => {
      const SomeComponent: any = () => {};
      const componentTypes = [() => <SomeComponent />];
      const SomeValue1 = createValue();

      const props = {
        componentTypes,
        componentDeps: [[SomeValue1]],
        index: 0,
      };

      const placeholderItem = new PlaceholderItem(props);
      placeholderItem.plugins = new Plugins();

      expect(placeholderItem.currentTemplate).toBeNull();
    });

    it('currentTemplate returns component if deps have values', () => {
      const SomeComponent: any = () => {};
      const componentTypes = [() => <SomeComponent />];
      const SomeValue = createValue();

      const props = {
        componentTypes,
        componentDeps: [[SomeValue]],
        index: 0,
      };

      const placeholderItem = new PlaceholderItem(props);
      placeholderItem.plugins = new Plugins();
      placeholderItem.plugins.set(SomeValue, 1);

      expect(placeholderItem.currentTemplate).toEqual(componentTypes[0]);
    });

    it('args returns values for componentDeps', () => {
      const SomeComponent: any = () => {};
      const componentTypes = [() => <SomeComponent />];
      const SomeValue = createValue();

      const props = {
        componentTypes,
        componentDeps: [[SomeValue]],
        index: 0,
      };

      const placeholderItem = new PlaceholderItem(props);
      placeholderItem.plugins = new Plugins();
      placeholderItem.updateArgs();
      placeholderItem.plugins.set(SomeValue, 1);

      expect(placeholderItem.args).toEqual([1]);
    });
  });

  describe('Effects', () => {
    it('updateArgs should update args to force render', () => {
      const SomeComponent: any = () => {};
      const SomeValue1 = createValue();
      const SomeValue2 = createValue();

      const props = {
        componentTypes: [(values) => <SomeComponent values={values} />],
        componentDeps: [[SomeValue1, SomeValue2]],
        index: 0,
      };

      const placeholderItem = new PlaceholderItem(props);
      placeholderItem.plugins = new Plugins();

      placeholderItem.updateArgs();

      placeholderItem.plugins.set(SomeValue1, 1);
      placeholderItem.plugins.set(SomeValue2, 2);

      expect(placeholderItem.args).toEqual([1, 2]);
    });

    it('updateArgs should not update args after dispose', () => {
      const SomeComponent: any = () => {};
      const SomeValue1 = createValue();

      const props = {
        componentTypes: [(values) => <SomeComponent values={values} />],
        componentDeps: [[SomeValue1]],
        index: 0,
      };

      const placeholderItem = new PlaceholderItem(props);
      placeholderItem.plugins = new Plugins();

      placeholderItem.plugins.set(SomeValue1, 0);

      const dispose = placeholderItem.updateArgs();

      dispose();

      placeholderItem.plugins.set(SomeValue1, 1);

      expect(placeholderItem.args).toEqual([0]);
    });
  });
});
