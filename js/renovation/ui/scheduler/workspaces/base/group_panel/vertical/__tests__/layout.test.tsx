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
      groupsRenderData,
      style: defaultStyle,
      ...viewModel,
      props: {
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

      expect(layout.hasClass('dx-scheduler-work-space-vertical-group-table'))
        .toBe(true);
      expect(layout.hasClass('custom-class'))
        .toBe(true);
      expect(layout.childAt(0).hasClass('dx-scheduler-group-flex-container'))
        .toBe(true);
    });

    it('should render two rows and pass correct props to them', () => {
      const cellTemplate = jest.fn();
      const layout = render({
        props: { cellTemplate },
      });

      const rows = layout.find(Row);
      expect(rows)
        .toHaveLength(2);

      expect(rows.at(0).props())
        .toMatchObject({
          groupItems: groupsRenderData[0],
          cellTemplate,
        });
      expect(rows.at(1).props())
        .toMatchObject({
          groupItems: groupsRenderData[1],
          cellTemplate,
        });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('style', () => {
        it('should call addHeightToStyle with proper parameters', () => {
          const style = { width: '555px', height: '666px' };
          const layout = new Layout({ height: 500 });
          layout.restAttributes = { style };

          expect(layout.style)
            .toBe('style');

          expect(addHeightToStyle)
            .toHaveBeenCalledWith(500, style);
        });
      });

      describe('groupsRenderData', () => {
        it('should transform grouping data into group items', () => {
          const groups = [{
            name: 'group 1',
            items: [{
              text: 'item 1', id: 1, color: 'color 1',
            }, {
              text: 'item 2', id: 2, color: 'color 2',
            }],
            data: [{
              text: 'item 1', id: 1, color: 'color 1',
            }, {
              text: 'item 2', id: 2, color: 'color 2',
            }],
          }, {
            name: 'group 2',
            items: [{
              text: 'item 3', id: 1, color: 'color 3',
            }, {
              text: 'item 4', id: 2, color: 'color 4',
            }],
            data: [{
              text: 'item 3', id: 1, color: 'color 3',
            }, {
              text: 'item 4', id: 2, color: 'color 4',
            }],
          }];
          const layout = new Layout({
            groups,
          });

          expect(layout.groupsRenderData)
            .toEqual([[{
              ...groups[0].items[0],
              data: groups[0].data[0],
              resourceName: groups[0].name,
              key: '0_group 1_1',
            }, {
              ...groups[0].items[1],
              data: groups[0].data[1],
              resourceName: groups[0].name,
              key: '0_group 1_2',
            }], [{
              ...groups[1].items[0],
              data: groups[1].data[0],
              resourceName: groups[1].name,
              key: '0_group 2_1',
            }, {
              ...groups[1].items[1],
              data: groups[1].data[1],
              resourceName: groups[1].name,
              key: '0_group 2_2',
            }, {
              ...groups[1].items[0],
              data: groups[1].data[0],
              resourceName: groups[1].name,
              key: '1_group 2_1',
            }, {
              ...groups[1].items[1],
              data: groups[1].data[1],
              resourceName: groups[1].name,
              key: '1_group 2_2',
            }]]);
        });
      });
    });
  });
});
