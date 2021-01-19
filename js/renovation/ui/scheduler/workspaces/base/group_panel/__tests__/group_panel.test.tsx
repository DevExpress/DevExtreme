import { mount } from 'enzyme';
import {
  GroupPanel,
  viewFunction as GroupPanelView,
} from '../group_panel';
import { GroupPanelVerticalLayout } from '../vertical/layout';
import { VERTICAL_GROUP_ORIENTATION, HORIZONTAL_GROUP_ORIENTATION } from '../../../../consts';
import { GroupPanelHorizontalLayout } from '../horizontal/layout';

describe('GroupPanel Vertical Layout', () => {
  describe('Render', () => {
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
    }];
    const groupOrientation = VERTICAL_GROUP_ORIENTATION;

    const render = (viewModel) => mount(GroupPanelView({
      layout: GroupPanelVerticalLayout,
      ...viewModel,
      props: {
        groups,
        groupOrientation,
        height: 500,
        groupByDate: false,
        ...viewModel.props,
      },
    }));

    it('should pass correct props to the root component', () => {
      const resourceCellTemplate = () => null;
      const groupPanel = render({
        props: { resourceCellTemplate, className: 'custom-class' },
      });

      expect(groupPanel.props())
        .toMatchObject({
          groups,
          height: 500,
          resourceCellTemplate,
          groupByDate: false,
          className: 'custom-class',
        });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('layout', () => {
        it('should return vertical layout when groupOrientation is vertical', () => {
          const groupPanel = new GroupPanel({
            groupOrientation: VERTICAL_GROUP_ORIENTATION,
          });

          expect(groupPanel.layout)
            .toBe(GroupPanelVerticalLayout);
        });

        it('should return horizontal layout when groupOrientation is horizontal', () => {
          const groupPanel = new GroupPanel({
            groupOrientation: HORIZONTAL_GROUP_ORIENTATION,
          });

          expect(groupPanel.layout)
            .toBe(GroupPanelHorizontalLayout);
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
          const groupPanel = new GroupPanel({
            groups,
          });

          expect(groupPanel.groupsRenderData)
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

        it('should work when data parameter is undefined', () => {
          const groups = [{
            name: 'group 1',
            items: [{
              text: 'item 1', id: 1, color: 'color 1',
            }, {
              text: 'item 2', id: 2, color: 'color 2',
            }],
          }];
          const groupPanel = new GroupPanel({
            groups,
          });

          expect(groupPanel.groupsRenderData)
            .toEqual([[{
              ...groups[0].items[0],
              resourceName: groups[0].name,
              key: '0_group 1_1',
            }, {
              ...groups[0].items[1],
              resourceName: groups[0].name,
              key: '0_group 1_2',
            }]]);
        });
      });
    });
  });
});
