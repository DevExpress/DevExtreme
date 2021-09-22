import { shallow, ShallowWrapper } from 'enzyme';
import { AllDayPanelTitle, AllDayPanelTitleProps } from '../date_table/all_day_panel/title';
import { viewFunction as HeaderEmptyCellView } from '../header_panel_empty_cell';

jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  getGroupCellClasses: jest.fn(),
}));

describe('DateTableCellBase', () => {
  describe('Render', () => {
    const render = (viewModel): ShallowWrapper => shallow(HeaderEmptyCellView({
      ...viewModel,
      props: { ...viewModel.props },
    }));

    it('should pass correct props to root', () => {
      const root = render({
        props: {
          width: 500,
        },
      });

      expect(root.props())
        .toEqual({
          style: { width: 500 },
          className: 'dx-scheduler-header-panel-empty-cell',
        });
    });

    it('should render all-day title when necessary', () => {
      const root = render({
        props: {
          isRenderAllDayTitle: true,
          isSetAllDayTitleClass: true,
        },
      });

      const allDayTitle = root.childAt(0);
      expect(allDayTitle.is(AllDayPanelTitle))
        .toBe(true);

      expect(allDayTitle.props())
        .toEqual({
          ...new AllDayPanelTitleProps(),
          visible: true,
          isSetTitleClass: true,
        });
    });

    it('should not render all-day title when "isRenderAllDayTitle" is flase', () => {
      const root = render({
        props: {
          isRenderAllDayTitle: true,
          isSetAllDayTitleClass: true,
        },
      });

      expect(root.find(AllDayPanelTitle).exists())
        .toBe(true);
    });
  });
});
