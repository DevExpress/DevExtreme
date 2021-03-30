import { mount } from 'enzyme';
import { GridBaseViews, viewFunction } from '../grid_base_views';
import { GridBaseViewWrapper } from '../grid_base_view_wrapper';

jest.mock('../grid_base_view_wrapper', () => ({ GridBaseViewWrapper: () => null }));

const GRIDBASE_CONTAINER_CLASS = 'dx-gridbase-container';

describe('GridBaseViews', () => {
  describe('View', () => {
    it('default render', () => {
      const options = {
        props: {
          views: [
            { name: 'view1', view: 'viewComponent1' },
            { name: 'view2', view: 'viewComponent2' },
          ],
          className: 'myClass',
        },
      } as unknown as GridBaseViews;
      const tree = mount(viewFunction(options));

      expect(tree.hasClass('myClass')).toBe(true);
      expect(tree.hasClass(GRIDBASE_CONTAINER_CLASS)).toBe(true);
      expect(tree.children().length).toBe(2);
      expect(tree.find(GridBaseViewWrapper).length).toBe(2);
      expect(tree.find(GridBaseViewWrapper).get(0).key).toBe('view1');
      expect(tree.find(GridBaseViewWrapper).get(0).props.view).toBe('viewComponent1');
      expect(tree.find(GridBaseViewWrapper).get(1).key).toBe('view2');
      expect(tree.find(GridBaseViewWrapper).get(1).props.view).toBe('viewComponent2');
    });
  });
});
