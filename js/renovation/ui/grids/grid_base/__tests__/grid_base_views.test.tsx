import { mount } from 'enzyme';
import { GridBaseViews, viewFunction } from '../grid_base_views';
import { GridBaseViewWrapper } from '../grid_base_view_wrapper';
import { GridBaseViewProps } from '../common/grid_base_view_props';

jest.mock('../grid_base_view_wrapper', () => ({ GridBaseViewWrapper: () => null }));

const GRIDBASE_CONTAINER_CLASS = 'dx-gridbase-container';

describe('GridBaseViews', () => {
  describe('View', () => {
    it('default render', () => {
      const props = {
        views: [
          { name: 'view1', view: 'viewComponent1' },
          { name: 'view2', view: 'viewComponent2' },
        ],
      } as unknown as GridBaseViewProps;
      const options = {
        props: new GridBaseViewProps(),
        className: 'myClass',
        viewRendered: () => {},
      } as unknown as GridBaseViews;
      options.props = { ...options.props, ...props };
      const tree = mount(viewFunction(options));

      expect(tree.hasClass('myClass')).toBe(true);
      expect(tree.children().length).toBe(2);
      expect(tree.find(GridBaseViewWrapper).length).toBe(2);
      expect(tree.find(GridBaseViewWrapper).get(0).key).toBe('view1');
      expect(tree.find(GridBaseViewWrapper).get(0).props.view).toBe('viewComponent1');
      expect(tree.find(GridBaseViewWrapper).get(0).props.onRendered).toBe(options.viewRendered);
      expect(tree.find(GridBaseViewWrapper).get(1).key).toBe('view2');
      expect(tree.find(GridBaseViewWrapper).get(1).props.view).toBe('viewComponent2');
      expect(tree.find(GridBaseViewWrapper).get(1).props.onRendered).toBe(options.viewRendered);
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      it('Get className', () => {
        const props = {
          className: 'my-widget',
        } as any;
        const component = new GridBaseViews(props);

        expect(component.className).toBe(`${GRIDBASE_CONTAINER_CLASS} my-widget`);
      });

      it('Get className with showBorders is true', () => {
        const props = {
          className: 'my-widget',
          showBorders: true,
        } as any;
        const component = new GridBaseViews(props);

        expect(component.className).toBe(`${GRIDBASE_CONTAINER_CLASS} my-widget my-widget-borders`);
      });
    });
  });

  describe('Events', () => {
    it('onRendered event should be fired when all views are rendered', () => {
      const props = {
        views: [
          { name: 'view1', view: 'viewComponent1' },
          { name: 'view2', view: 'viewComponent2' },
        ],
        onRendered: jest.fn(),
      } as unknown as GridBaseViewProps;

      const component = new GridBaseViews(props);

      component.viewRendered();

      expect(props.onRendered).toBeCalledTimes(0);

      component.viewRendered();

      expect(props.onRendered).toBeCalledTimes(1);
    });

    it('onRendered is not defined', () => {
      const props = {
        views: [
          { name: 'view1', view: 'viewComponent1' },
        ],
      } as unknown as GridBaseViewProps;

      const component = new GridBaseViews(props);

      component.viewRendered();

      expect(props.onRendered).toBe(undefined);
    });
  });
});
