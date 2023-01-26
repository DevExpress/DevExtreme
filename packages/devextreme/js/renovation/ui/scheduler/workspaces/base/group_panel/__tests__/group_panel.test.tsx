import React from 'react';
import { mount } from 'enzyme';
import {
  GroupPanel,
  viewFunction as GroupPanelView,
} from '../group_panel';
import { GroupPanelVerticalLayout } from '../vertical/layout';
import { VERTICAL_GROUP_ORIENTATION, HORIZONTAL_GROUP_ORIENTATION } from '../../../../consts';

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

    [
      true,
      false,
    ].forEach((isVerticalLayout) => {
      it(`should pass ref to the root if isVerticalLayout=${isVerticalLayout}`, () => {
        const ref = React.createRef();
        render({
          isVerticalLayout: true,
          props: {
            elementRef: ref,
          },
        });

        expect(ref.current)
          .not.toBe(null);
      });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('isVerticalLayout', () => {
        [
          {
            orientation: VERTICAL_GROUP_ORIENTATION,
            expected: true,
          }, {
            orientation: HORIZONTAL_GROUP_ORIENTATION,
            expected: false,
          },
        ].forEach(({ orientation, expected }) => {
          it(`should return correct value if ${orientation} group orientation`, () => {
            const groupPanel = new GroupPanel({
              groupOrientation: orientation as any,
              groups: [{
                name: 'groupId',
                items: [{ id: 1 }],
                data: [{ id: 1 }],
              }],
            });

            expect(groupPanel.isVerticalLayout)
              .toBe(expected);
          });
        });
      });
    });
  });
});
