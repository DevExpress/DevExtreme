import { mount } from 'enzyme';
import { DataGridViews, viewFunction } from '../data_grid_views';
import { DataGridViewWrapper } from '../data_grid_view_wrapper';

jest.mock('../data_grid_view_wrapper', () => ({ DataGridViewWrapper: () => null }));

const GRIDBASE_CONTAINER_CLASS = 'dx-gridbase-container';

describe('DataGridViews', () => {
  describe('View', () => {
    it('default render', () => {
      const props = {
        views: [
          { name: 'view1', view: 'viewComponent1' },
          { name: 'view2', view: 'viewComponent2' },
        ],
      } as any;
      const tree = mount(viewFunction(props));

      expect(tree.hasClass(GRIDBASE_CONTAINER_CLASS)).toBe(true);
      expect(tree.children().length).toBe(2);
      expect(tree.find(DataGridViewWrapper).length).toBe(2);
      expect(tree.find(DataGridViewWrapper).get(0).key).toBe('view1');
      expect(tree.find(DataGridViewWrapper).get(0).props.view).toBe('viewComponent1');
      expect(tree.find(DataGridViewWrapper).get(1).key).toBe('view2');
      expect(tree.find(DataGridViewWrapper).get(1).props.view).toBe('viewComponent2');
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      it('Get views', () => {
        const props = {
          instance: {
            getView: (viewName) => viewName,
          },
        } as any;
        const component = new DataGridViews(props);

        expect(component.views.length > 0).toBe(true);
      });
    });
  });
});
