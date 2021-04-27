import { mount } from 'enzyme';
import {
  GroupPanelVerticalLayout as Layout,
  viewFunction as LayoutView,
} from '../layout';
import { Row } from '../row';
import { addHeightToStyle } from '../../../../utils';

jest.mock('../row', () => ({
  Row: () => null,
}));
jest.mock('../../../../utils', () => ({
  addHeightToStyle: jest.fn(() => 'style'),
}));

describe('GroupPanel Vertical Layout', () => {
  describe('Render', () => {
    const groupsRenderData = [[{
      id: 'testId 1',
      text: 'text 1',
      color: 'color 1',
      key: 'key 1',
      resourceName: 'resource 1',
      data: 'data 1',
    }], [{
      id: 'testId 2',
      text: 'text 2',
      color: 'color 2',
      key: 'key 2',
      resourceName: 'resource 2',
      data: 'data 2',
    }, {
      id: 'testId 3',
      text: 'text 3',
      color: 'color 3',
      key: 'key 3',
      resourceName: 'resource 3',
      data: 'data 3',
    }]];
    const defaultStyle = { color: 'red' };

    const render = (viewModel) => mount(LayoutView({
      style: defaultStyle,
      ...viewModel,
      props: {
        groupsRenderData,
        ...viewModel.props,
      },
    }) as any);

    it('should spread restAttributes correctly', () => {
      const layout = render({
        restAttributes: {
          'custom-attribute': 'customAttribute', style: { color: 'green' },
        },
      });

      expect(layout.prop('custom-attribute'))
        .toBe('customAttribute');
      expect(layout.prop('style'))
        .toEqual({ color: 'red' });
    });

    it('should pass correct class names to components', () => {
      const layout = render({
        props: { className: 'custom-class' },
      });

      expect(layout.hasClass('custom-class'))
        .toBe(true);
      expect(layout.childAt(0).hasClass('dx-scheduler-group-flex-container'))
        .toBe(true);
    });

    it('should render two rows and pass correct props to them', () => {
      const resourceCellTemplate = jest.fn();
      const layout = render({
        props: { resourceCellTemplate },
      });

      const rows = layout.find(Row);
      expect(rows)
        .toHaveLength(2);

      expect(rows.at(0).props())
        .toMatchObject({
          groupItems: groupsRenderData[0],
          cellTemplate: resourceCellTemplate,
        });
      expect(rows.at(1).props())
        .toMatchObject({
          groupItems: groupsRenderData[1],
          cellTemplate: resourceCellTemplate,
        });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('style', () => {
        it('should call addHeightToStyle with proper parameters', () => {
          const styles = { width: '555px', height: '666px' };
          const layout = new Layout({ height: 500, styles });

          expect(layout.style)
            .toBe('style');

          expect(addHeightToStyle)
            .toHaveBeenCalledWith(500, styles);
        });
      });
    });
  });
});
