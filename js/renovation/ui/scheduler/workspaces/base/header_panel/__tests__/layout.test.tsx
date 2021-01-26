import { shallow } from 'enzyme';
import {
  viewFunction as LayoutView,
  HeaderPanelLayout,
  HeaderPanelLayoutProps,
} from '../layout';
import * as utilsModule from '../../../utils';
import { HORIZONTAL_GROUP_ORIENTATION, VERTICAL_GROUP_ORIENTATION } from '../../../../consts';
import { GroupPanel } from '../../group_panel/group_panel';
import { DateHeaderLayout } from '../date_header/layout';

const isHorizontalGroupOrientation = jest.spyOn(utilsModule, 'isHorizontalGroupOrientation');

describe('HeaderPanelLayoutLayout', () => {
  describe('Render', () => {
    const dateHeaderMap = [[]];

    const render = (viewModel) => shallow(LayoutView({
      isHorizontalGrouping: false,
      ...viewModel,
      props: {
        ...(new HeaderPanelLayoutProps()),
        dateHeaderMap,
        groupOrientation: HORIZONTAL_GROUP_ORIENTATION,
        groups: [],
        ...viewModel.props,
      },
    }) as any);

    it('should render DateHeader and should not render GroupPanel in basic case', () => {
      const dateCellTemplate = () => null;
      const layout = render({ props: { dateCellTemplate } });

      const groupPanel = layout.find(GroupPanel);
      expect(groupPanel.exists())
        .toBe(false);

      const dateHeader = layout.find(DateHeaderLayout);
      expect(dateHeader.exists())
        .toBe(true);

      expect(dateHeader.props())
        .toEqual({
          dateHeaderMap,
          dateCellTemplate,
          groupOrientation: HORIZONTAL_GROUP_ORIENTATION,
          groups: [],
        });
    });

    it('should not render DateHeader if "isRenderDateHeader" is false', () => {
      const layout = render({ props: { isRenderDateHeader: false } });

      const dateHeader = layout.find(DateHeaderLayout);
      expect(dateHeader.exists())
        .toBe(false);
    });

    it('should render DateHeader after GroupPanel in case of horizontal grouping', () => {
      const layout = render({ isHorizontalGrouping: true });

      expect(layout.children())
        .toHaveLength(2);
      expect(layout.childAt(0).is(GroupPanel))
        .toBe(true);
      expect(layout.childAt(1).is(DateHeaderLayout))
        .toBe(true);
    });

    it('should render DateHeader before GroupPanel in case of grouping by date', () => {
      const layout = render({ isHorizontalGrouping: true, props: { groupByDate: true } });

      expect(layout.children())
        .toHaveLength(2);
      expect(layout.childAt(0).is(DateHeaderLayout))
        .toBe(true);
      expect(layout.childAt(1).is(GroupPanel))
        .toBe(true);
    });

    it('should pass correct props to GroupPanel', () => {
      const resourceCellTemplate = () => null;
      const groupPanelProps = {
        baseColSpan: 3,
        columnCountPerGroup: 3,
        groupByDate: false,
        groups: [],
        resourceCellTemplate,
      };

      const layout = render({
        isHorizontalGrouping: true,
        props: groupPanelProps,
      });

      const groupPanel = layout.find(GroupPanel);

      expect(groupPanel.props())
        .toEqual({
          ...groupPanelProps,
          groupOrientation: HORIZONTAL_GROUP_ORIENTATION,
        });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('isHorizontalGrouping', () => {
        it('should call "isHorizontalGroupOrientation" with correct parameters', () => {
          const groups = [];
          const layout = new HeaderPanelLayout({
            groupOrientation: VERTICAL_GROUP_ORIENTATION,
            groups,
          });

          expect(layout.isHorizontalGrouping)
            .toBe(false);

          expect(isHorizontalGroupOrientation)
            .toHaveBeenCalledWith(groups, VERTICAL_GROUP_ORIENTATION);
        });
      });
    });
  });
});
