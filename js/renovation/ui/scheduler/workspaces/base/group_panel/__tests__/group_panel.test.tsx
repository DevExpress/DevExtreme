import { mount } from 'enzyme';
import {
  GroupPanel,
  viewFunction as GroupPanelView,
} from '../group_panel';
import { GroupPanelVerticalLayout } from '../vertical/layout';
import { VERTICAL_GROUP_ORIENTATION, HORIZONTAL_GROUP_ORIENTATION } from '../../../../consts';
import { GroupPanelHorizontalLayout } from '../horizontal/layout';

describe('GroupPanel', () => {
  describe('Render', () => {
    const groupOrientation = VERTICAL_GROUP_ORIENTATION;

    const render = (viewModel) => mount(GroupPanelView({
      layout: GroupPanelVerticalLayout,
      ...viewModel,
      restAttributes: { style: { height: 724 } },
      props: {
        groupOrientation,
        height: 500,
        groupByDate: false,
        ...viewModel.props,
      },
    }));

    it('should pass correct props to the root component', () => {
      const resourceCellTemplate = () => null;
      const groupPanel = render({
        props: {
          resourceCellTemplate,
          className: 'custom-class',
          groupPanelData: {
            groupPanelItems: [],
            baseColSpan: 4,
          },
        },
      });

      expect(groupPanel.props())
        .toEqual({
          height: 500,
          resourceCellTemplate,
          groupByDate: false,
          className: 'custom-class',
          styles: { height: 724 },
          groupPanelData: {
            groupPanelItems: [],
            baseColSpan: 4,
          },
        });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('layout', () => {
        it('should return vertical layout when groupOrientation is vertical', () => {
          const groupPanel = new GroupPanel({
            groupOrientation: VERTICAL_GROUP_ORIENTATION,
            groups: [{
              name: 'groupId',
              items: [{ id: 1 }],
              data: [{ id: 1 }],
            }],
          });

          expect(groupPanel.layout)
            .toBe(GroupPanelVerticalLayout);
        });

        it('should return horizontal layout when groupOrientation is horizontal', () => {
          const groupPanel = new GroupPanel({
            groupOrientation: HORIZONTAL_GROUP_ORIENTATION,
            groups: [{
              name: 'groupId',
              items: [{ id: 1 }],
              data: [{ id: 1 }],
            }],
          });

          expect(groupPanel.layout)
            .toBe(GroupPanelHorizontalLayout);
        });
      });
    });
  });
});
