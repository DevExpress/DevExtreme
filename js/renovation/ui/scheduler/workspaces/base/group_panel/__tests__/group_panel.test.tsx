import { mount } from 'enzyme';
import {
  GroupPanel,
  viewFunction as GroupPanelView,
} from '../group_panel';
import { GroupPanelVerticalLayout } from '../vertical/layout';
import { VERTICAL_GROUP_ORIENTATION, HORIZONTAL_GROUP_ORIENTATION } from '../../../../consts';

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
            .toBe(GroupPanelVerticalLayout); // TODO
        });
      });
    });
  });
});
