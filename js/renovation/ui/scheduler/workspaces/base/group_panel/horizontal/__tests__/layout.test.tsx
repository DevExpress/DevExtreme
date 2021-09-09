import { mount } from 'enzyme';
import {
  GroupPanelHorizontalLayout as Layout,
  viewFunction as LayoutView,
} from '../layout';
import { Row } from '../row';

jest.mock('../row', () => ({
  Row: () => null,
}));

describe('GroupPanel Horizontal Layout', () => {
  describe('Render', () => {
    const groupPanelItems = [[{
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
      groupPanelItems,
      style: defaultStyle,
      ...viewModel,
      props: {
        ...viewModel.props,
      },
    }) as any);

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
          groupItems: groupPanelItems[0],
          cellTemplate: resourceCellTemplate,
        });
      expect(rows.at(1).props())
        .toMatchObject({
          groupItems: groupPanelItems[1],
          cellTemplate: resourceCellTemplate,
        });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('groupPanelItems', () => {
        const groupPanelData = {
          groupPanelItems: [[{
            id: 'testId 1',
            text: 'text 1',
            color: 'color 1',
            key: 'key 1',
            resourceName: 'resource 1',
            data: 'data 1',
          }, {
            id: 'testId 2',
            text: 'text 2',
            color: 'color 2',
            key: 'key 2',
            resourceName: 'resource 2',
            data: 'data 2',
          }], [{
            id: 'testId 3',
            text: 'text 3',
            color: 'color 3',
            key: 'key 3',
            resourceName: 'resource 3',
            data: 'data 3',
          }, {
            id: 'testId 4',
            text: 'text 4',
            color: 'color 4',
            key: 'key 4',
            resourceName: 'resource 4',
            data: 'data 4',
          }, {
            id: 'testId 5',
            text: 'text 5',
            color: 'color 5',
            key: 'key 2',
            resourceName: 'resource 5',
            data: 'data 5',
          }, {
            id: 'testId 6',
            text: 'text 6',
            color: 'color 6',
            key: 'key 7',
            resourceName: 'resource 7',
            data: 'data 7',
          }]],
          baseColSpan: 20,
        } as any;

        it('should add colspans to group items', () => {
          const layout = new Layout({
            groupPanelData,
          });

          const { groupPanelItems } = groupPanelData;

          expect(layout.groupPanelItems)
            .toEqual([[{
              ...groupPanelItems[0][0],
              colSpan: 40,
            }, {
              ...groupPanelItems[0][1],
              colSpan: 40,
            }], [{
              ...groupPanelItems[1][0],
              colSpan: 20,
            }, {
              ...groupPanelItems[1][1],
              colSpan: 20,
            }, {
              ...groupPanelItems[1][2],
              colSpan: 20,
            }, {
              ...groupPanelItems[1][3],
              colSpan: 20,
            }]]);
        });
      });
    });
  });
});
