import { createRef } from 'react';
import { mount } from 'enzyme';
import { GridBaseViewWrapper, viewFunction } from '../grid_base_view_wrapper';
import $ from '../../../../../core/renderer';

describe('DataGridViews', () => {
  describe('View', () => {
    it('default render', () => {
      const viewRef = createRef();
      const props = {
        viewRef,
      } as any;
      const tree = mount(viewFunction(props));

      expect(tree.find('div').instance()).toBe(viewRef.current);
    });
  });

  describe('Logic', () => {
    it('Render view', () => {
      const viewRef = createRef() as any;
      const view = {
        render: jest.fn(),
      };
      const props = {
        view,
      } as any;
      const component = new GridBaseViewWrapper(props);
      component.viewRef = viewRef;

      component.renderView();

      expect(component.props.view).toMatchObject({
        _$element: $(viewRef.current),
      });
      expect(component.props.view.render).toHaveBeenCalledTimes(1);
    });
  });
});
