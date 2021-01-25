import { shallow } from 'enzyme';
import {
  viewFunction as LayoutView,
  HeaderPanel,
  HeaderPanelProps,
} from '../layout';
import * as utilsModule from '../../../utils';
import { HORIZONTAL_GROUP_ORIENTATION, VERTICAL_GROUP_ORIENTATION } from '../../../../consts';
import { GroupPanel } from '../../group_panel/group_panel';
import { DateHeader } from '../date_header/layout';

const isHorizontalGroupOrientation = jest.spyOn(utilsModule, 'isHorizontalGroupOrientation');

describe('HeaderPanelLayoutBase', () => {
  describe('Render', () => {
    const dateHeaderMap = [[]];

    const render = (viewModel) => shallow(LayoutView({
      ...viewModel,
      props: {
        ...(new HeaderPanelProps()),
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

      const dateHeader = layout.find(DateHeader);
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
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('isHorizontalGrouping', () => {
        it('should call "isHorizontalGroupOrientation" with correct parameters', () => {
          const groups = [];
          const layout = new HeaderPanel({
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
