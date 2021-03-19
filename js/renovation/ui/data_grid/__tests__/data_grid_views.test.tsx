import { mount } from 'enzyme';
import { DataGridViews, viewFunction } from '../data_grid_views';
import { GridBaseViews } from '../../grid_core/grid_base_views';

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

      expect(tree.find(GridBaseViews).length).toBe(1);
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

      it('Get views when the instance has no views', () => {
        const props = {
          instance: {
            getView: jest.fn(),
          },
        } as any;
        const component = new DataGridViews(props);

        expect(component.views.length).toBe(0);
      });

      it('Get views when there is not instance', () => {
        const props = {} as any;
        const component = new DataGridViews(props);

        expect(component.views.length).toBe(0);
      });
    });
  });
});
