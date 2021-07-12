import { shallow, mount } from 'enzyme';
import { Scrollable } from '../../../../scroll_view/scrollable';
import { Widget } from '../../../../common/widget';
import { LayoutBase, LayoutBaseProps, viewFunction as LayoutView } from '../layout';
import { GroupPanel } from '../group_panel/group_panel';
import { AllDayPanelLayout, AllDayPanelLayoutProps } from '../date_table/all_day_panel/layout';
import { AllDayPanelTitle, AllDayPanelTitleProps } from '../date_table/all_day_panel/title';
import { combineClasses } from '../../../../../utils/combine_classes';
import { isVerticalGroupingApplied } from '../../utils';

jest.mock('../../../../../utils/combine_classes', () => ({
  combineClasses: jest.fn(),
}));
jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  isVerticalGroupingApplied: jest.fn(),
}));

describe('LayoutBase', () => {
  const viewData = {
    groupedData: [{
      allDayPane: [],
      dateTable: [[
        {
          startDate: new Date(2020, 6, 9),
          endDate: new Date(2020, 6, 10),
          today: true,
          groups: 1,
        },
        {
          startDate: new Date(2020, 6, 10),
          endDate: new Date(2020, 6, 11),
          today: false,
          groups: 2,
        },
      ], [
        {
          startDate: new Date(2020, 6, 11),
          endDate: new Date(2020, 6, 12),
          today: false,
          groups: 3,
        },
        {
          startDate: new Date(2020, 6, 12),
          endDate: new Date(2020, 6, 13),
          today: false,
          groups: 4,
        },
      ]],
    }],
  };
  const dateHeaderData = {
    dataMap: [],
    leftVirtualCellWidth: 0,
    rightVirtualCellWidth: 0,
    leftVirtualCellCount: 0,
    rightVirtualCellCount: 0,
  };
  const timePanelData = {
    groupedData: [],
    cellCountInGroupRow: 0,
    leftVirtualCellCount: 0,
    rightVirtualCellCount: 0,
    topVirtualRowCount: 0,
    bottomVirtualRowCount: 0,
  };
  const groups = [{
    name: 'resourceId',
    data: [{
      text: 'Resource 1',
      id: 0,
    }, {
      text: 'Resource 2',
      id: 1,
    }],
    items: [{
      text: 'Resource 1',
      id: 0,
    }, {
      text: 'Resource 2',
      id: 1,
    }],
  }];

  describe('Render', () => {
    const headerPanelTemplate = () => null;
    const dateTableTemplate = () => null;
    const commonProps = {
      headerPanelTemplate,
      dateTableTemplate,
      viewData,
      dateHeaderData,
      timePanelData,
    };

    const render = (viewModel) => shallow(LayoutView({
      ...viewModel,
      props: {
        ...commonProps,
        ...viewModel.props,
      },
    }) as any);
    const mountComponent = (viewModel) => mount(LayoutView({
      ...viewModel,
      props: {
        ...commonProps,
        ...viewModel.props,
      },
    }) as any);

    it('should render widget as root component', () => {
      const layout = mountComponent({
        classes: 'custom-classes',
      });

      expect(layout.is(Widget))
        .toBe(true);
      expect(layout.prop('className'))
        .toBe('custom-classes');
    });

    it('should render HeaderPanel and pass to it correct props', () => {
      const props = {
        dateHeaderData,
        timeCellTemplate: () => null,
        dateCellTemplate: () => null,
        isRenderDateHeader: true,

        groupPanelCellBaseColSpan: 4,
        groupOrientation: 'horizontal',
        groupByDate: false,
        groups,
        columnCountPerGroup: 32,
        resourceCellTemplate: () => null,
      };
      const layout = render({ props });

      const headerTable = layout.find('.dx-scheduler-header-panel');

      expect(headerTable.exists())
        .toBe(true);
      expect(headerTable.is('table'))
        .toBe(true);

      const headerPanel = headerTable.childAt(0);

      expect(headerPanel.exists())
        .toBe(true);
      expect(headerPanel.is(headerPanelTemplate))
        .toBe(true);
      expect(headerPanel.props())
        .toEqual(props);
    });

    it('should render scrollable and pass correct props to it', () => {
      const layout = render({});

      const scrollable = layout.find(Scrollable);

      expect(scrollable.props())
        .toEqual({
          useKeyboard: false,
          bounceEnabled: false,
          className: 'dx-scheduler-date-table-scrollable',
          children: expect.anything(),
        });
    });

    it('should render date-table and pass to it correct props', () => {
      const props = {
        viewData,
        groupOrientation: 'horizontal',
        dataCellTemplate: () => null,
      };
      const layout = render({
        props,
        dateTableRef: 'dateTableRef',
      });

      const dateTable = layout.find(dateTableTemplate);

      expect(dateTable.exists())
        .toBe(true);
      expect(dateTable.props())
        .toEqual({
          ...props,
          tableRef: 'dateTableRef',
        });
    });

    it('should not render time panel and group panel', () => {
      const layout = render({});

      const scrollable = layout.find(Scrollable);

      expect(scrollable.children().length)
        .toBe(1);
      expect(scrollable.childAt(0).is(dateTableTemplate))
        .toBe(true);
    });

    it('should render time panel when it is passed as a prop', () => {
      const timePanelTemplate = () => null;
      const props = {
        timeCellTemplate: () => {},
        groupOrientation: 'vertical',
        timePanelData,
      };

      const layout = render({
        props: {
          timePanelTemplate,
          ...props,
        },
      });

      const scrollable = layout.find(Scrollable);

      expect(scrollable.children().length)
        .toBe(2);

      const timePanel = scrollable.childAt(0);

      expect(timePanel.is(timePanelTemplate))
        .toBe(true);
      expect(timePanel.props())
        .toEqual(props);
    });

    it('should render group panel when isRenderGroupPanel is true', () => {
      const resourceCellTemplate = () => null;
      const props = {
        groupPanelCellBaseColSpan: 34,
        groupOrientation: 'vertical',
        groupByDate: false,
        groups,
        columnCountPerGroup: 34,
        resourceCellTemplate,
        groupPanelClassName: 'groupPanelClassName',
      };
      const layout = render({
        isRenderGroupPanel: true,
        props,
        groupPanelHeight: 497,
      });

      const scrollable = layout.find(Scrollable);

      expect(scrollable.children().length)
        .toBe(2);

      const groupPanel = scrollable.childAt(0);

      expect(groupPanel.is(GroupPanel))
        .toBe(true);
      expect(groupPanel.props())
        .toEqual({
          groupOrientation: 'vertical',
          groupByDate: false,
          groups,
          columnCountPerGroup: 34,
          resourceCellTemplate,
          height: 497,
          baseColSpan: 34,
          className: 'groupPanelClassName',
        });
    });

    it('should not render all-day panel by default', () => {
      const layout = render({});

      expect(layout.find(AllDayPanelLayout).exists())
        .toBe(false);
      expect(layout.find(AllDayPanelTitle).exists())
        .toBe(false);
    });

    it('should render all-day panel when it is supported', () => {
      const dataCellTemplate = () => null;
      const layout = render({
        props: {
          isAllDayPanelSupported: true,
          dataCellTemplate,
        },
        isStandaloneAllDayPanel: true,
        isSetAllDayTitleClass: true,
      });

      const allDayPanel = layout.find(AllDayPanelLayout);
      const allDayPanelTitle = layout.find(AllDayPanelTitle);

      expect(allDayPanel.exists())
        .toBe(true);
      expect(allDayPanelTitle.exists())
        .toBe(true);

      expect(allDayPanel.props())
        .toEqual({
          ...new AllDayPanelLayoutProps(),
          viewData,
          dataCellTemplate,
          visible: true,
        });
      expect(allDayPanelTitle.props())
        .toEqual({
          ...new AllDayPanelTitleProps(),
          isSetTitleClass: true,
          visible: true,
        });
    });
  });

  describe('Behaviour', () => {
    describe('Effects', () => {
      describe('groupPanelHeightEffect', () => {
        it('should set groupPanelHeight', () => {
          const layout = new LayoutBase({} as any);

          layout.dateTableRef = {
            current: {
              getBoundingClientRect: () => ({
                height: 325,
              }),
            },
          } as any;

          layout.groupPanelHeightEffect();

          expect(layout.groupPanelHeight)
            .toBe(325);
        });

        it('should work if tableRef was not initialized', () => {
          const layout = new LayoutBase({} as any);

          layout.dateTableRef = {
            current: null,
          } as any;

          layout.groupPanelHeightEffect();

          expect(layout.groupPanelHeight)
            .toBe(undefined);
        });
      });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      afterEach(jest.resetAllMocks);

      describe('isRenderGroupPanel', () => {
        it('should call isVerticalGroupingApplied', () => {
          (isVerticalGroupingApplied as any).mockImplementationOnce(() => true);

          const layout = new LayoutBase({
            groups,
            groupOrientation: 'vertical',
          } as any);

          const result = layout.isRenderGroupPanel;

          expect(result)
            .toBe(true);
          expect(isVerticalGroupingApplied)
            .toBeCalledWith(groups, 'vertical');
        });
      });

      describe('isStandaloneAllDayPanel', () => {
        it('should return true when vertical group orientation is not used and all day panel is visible', () => {
          (isVerticalGroupingApplied as any).mockImplementationOnce(() => false);

          const layout = new LayoutBase({
            groups,
            groupOrientation: 'horizontal',
            isAllDayPanelVisible: true,
          } as any);

          const result = layout.isStandaloneAllDayPanel;

          expect(result)
            .toBe(true);
          expect(isVerticalGroupingApplied)
            .toBeCalledWith(groups, 'horizontal');
        });
      });

      it('should return false all day panel is not visible', () => {
        (isVerticalGroupingApplied as any).mockImplementationOnce(() => false);
        const layout = new LayoutBase({
          groups,
          groupOrientation: 'horizontal',
          isAllDayPanelVisible: false,
        } as any);

        const result = layout.isStandaloneAllDayPanel;

        expect(result)
          .toBe(false);
        expect(isVerticalGroupingApplied)
          .toBeCalledWith(groups, 'horizontal');
      });
    });

    describe('isSetAllDayTitleClass', () => {
      it('should call isVerticalGroupingApplied and revert its value', () => {
        const layout = new LayoutBase({
          groups,
          groupOrientation: 'horizontal',
        } as any);

        const result = layout.isSetAllDayTitleClass;

        expect(result)
          .toBe(true);
        expect(isVerticalGroupingApplied)
          .toBeCalledWith(groups, 'horizontal');
      });
    });

    describe('classes', () => {
      beforeEach(() => {
        (isVerticalGroupingApplied as any).mockImplementation(() => true);
      });

      afterEach(jest.resetAllMocks);

      it('should call combineClasses with correct parameters', () => {
        const layout = new LayoutBase({
          className: 'dx-scheduler-work-space-day',
          intervalCount: 35,
          isWorkSpaceWithOddCells: true,
          isAllDayPanelCollapsed: true,
          isAllDayPanelVisible: true,
          groupByDate: true,
          groups,
          groupOrientation: 'vertical',
        } as any);

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        layout.classes;

        expect(combineClasses)
          .toBeCalledWith({
            'dx-scheduler-work-space-day': true,
            'dx-scheduler-work-space-count': true,
            'dx-scheduler-work-space-odd-cells': true,
            'dx-scheduler-work-space-all-day-collapsed': true,
            'dx-scheduler-work-space-all-day': true,
            'dx-scheduler-work-space-group-by-date': true,
            'dx-scheduler-work-space-grouped': true,
            'dx-scheduler-work-space-vertical-grouped': true,
            'dx-scheduler-group-row-count-one': false,
            'dx-scheduler-group-row-count-two': false,
            'dx-scheduler-group-row-count-three': false,
            'dx-scheduler-group-column-count-one': true,
            'dx-scheduler-group-column-count-two': false,
            'dx-scheduler-group-column-count-three': false,
            'dx-scheduler-work-space': true,
          });
      });

      it('should call combineClasses with correct parameters when all-day panel is not collapsed', () => {
        const layout = new LayoutBase({
          className: 'dx-scheduler-work-space-day',
          intervalCount: 35,
          isWorkSpaceWithOddCells: true,
          isAllDayPanelCollapsed: false,
          isAllDayPanelVisible: true,
          groupByDate: true,
          groups,
          groupOrientation: 'vertical',
        } as any);

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        layout.classes;

        expect(combineClasses)
          .toBeCalledWith({
            'dx-scheduler-work-space-day': true,
            'dx-scheduler-work-space-count': true,
            'dx-scheduler-work-space-odd-cells': true,
            'dx-scheduler-work-space-all-day-collapsed': false,
            'dx-scheduler-work-space-all-day': true,
            'dx-scheduler-work-space-group-by-date': true,
            'dx-scheduler-work-space-grouped': true,
            'dx-scheduler-work-space-vertical-grouped': true,
            'dx-scheduler-group-row-count-one': false,
            'dx-scheduler-group-row-count-two': false,
            'dx-scheduler-group-row-count-three': false,
            'dx-scheduler-group-column-count-one': true,
            'dx-scheduler-group-column-count-two': false,
            'dx-scheduler-group-column-count-three': false,
            'dx-scheduler-work-space': true,
          });
      });

      it('should call combineClasses with correct parameters when all-day panel is not visible', () => {
        const layout = new LayoutBase({
          className: 'dx-scheduler-work-space-day',
          intervalCount: 35,
          isWorkSpaceWithOddCells: true,
          isAllDayPanelCollapsed: true,
          isAllDayPanelVisible: false,
          groupByDate: true,
          groups,
          groupOrientation: 'vertical',
        } as any);

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        layout.classes;

        expect(combineClasses)
          .toBeCalledWith({
            'dx-scheduler-work-space-day': true,
            'dx-scheduler-work-space-count': true,
            'dx-scheduler-work-space-odd-cells': true,
            'dx-scheduler-work-space-all-day-collapsed': false,
            'dx-scheduler-work-space-all-day': false,
            'dx-scheduler-work-space-group-by-date': true,
            'dx-scheduler-work-space-grouped': true,
            'dx-scheduler-work-space-vertical-grouped': true,
            'dx-scheduler-group-row-count-one': false,
            'dx-scheduler-group-row-count-two': false,
            'dx-scheduler-group-row-count-three': false,
            'dx-scheduler-group-column-count-one': true,
            'dx-scheduler-group-column-count-two': false,
            'dx-scheduler-group-column-count-three': false,
            'dx-scheduler-work-space': true,
          });
      });

      it('should call combineClasses with correct parameters when groups are empty', () => {
        (isVerticalGroupingApplied as any).mockImplementation(() => false);

        const layout = new LayoutBase({
          className: 'dx-scheduler-work-space-day',
          intervalCount: 35,
          isWorkSpaceWithOddCells: true,
          isAllDayPanelCollapsed: true,
          isAllDayPanelVisible: true,
          groupByDate: false,
          groups: [],
          groupOrientation: 'horizontal',
        } as any);

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        layout.classes;

        expect(combineClasses)
          .toBeCalledWith({
            'dx-scheduler-work-space-day': true,
            'dx-scheduler-work-space-count': true,
            'dx-scheduler-work-space-odd-cells': true,
            'dx-scheduler-work-space-all-day-collapsed': true,
            'dx-scheduler-work-space-all-day': true,
            'dx-scheduler-work-space-group-by-date': false,
            'dx-scheduler-work-space-grouped': false,
            'dx-scheduler-work-space-vertical-grouped': false,
            'dx-scheduler-group-row-count-one': false,
            'dx-scheduler-group-row-count-two': false,
            'dx-scheduler-group-row-count-three': false,
            'dx-scheduler-group-column-count-one': false,
            'dx-scheduler-group-column-count-two': false,
            'dx-scheduler-group-column-count-three': false,
            'dx-scheduler-work-space': true,
          });
      });

      it('should call combineClasses with correct parameters when groups are empty but groupOrientation is vertical', () => {
        (isVerticalGroupingApplied as any).mockImplementation(() => true);

        const layout = new LayoutBase({
          className: 'dx-scheduler-work-space-day',
          intervalCount: 35,
          isWorkSpaceWithOddCells: true,
          isAllDayPanelCollapsed: true,
          isAllDayPanelVisible: true,
          groupByDate: false,
          groups: [],
          groupOrientation: 'vertical',
        } as any);

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        layout.classes;

        expect(combineClasses)
          .toBeCalledWith({
            'dx-scheduler-work-space-day': true,
            'dx-scheduler-work-space-count': true,
            'dx-scheduler-work-space-odd-cells': true,
            'dx-scheduler-work-space-all-day-collapsed': true,
            'dx-scheduler-work-space-all-day': true,
            'dx-scheduler-work-space-group-by-date': false,
            'dx-scheduler-work-space-grouped': false,
            'dx-scheduler-work-space-vertical-grouped': true,
            'dx-scheduler-group-row-count-one': false,
            'dx-scheduler-group-row-count-two': false,
            'dx-scheduler-group-row-count-three': false,
            'dx-scheduler-group-column-count-one': false,
            'dx-scheduler-group-column-count-two': false,
            'dx-scheduler-group-column-count-three': false,
            'dx-scheduler-work-space': true,
          });
      });

      [{
        groups: [{
          items: [],
          data: [],
          name: 'group 1',
        }],
        groupOrientation: 'vertical',
        className: 'dx-scheduler-group-column-count-one',
      }, {
        groups: [{
          items: [],
          data: [],
          name: 'group 1',
        }, {
          items: [],
          data: [],
          name: 'group 2',
        }],
        groupOrientation: 'vertical',
        className: 'dx-scheduler-group-column-count-two',
      }, {
        groups: [{
          items: [],
          data: [],
          name: 'group 1',
        }, {
          items: [],
          data: [],
          name: 'group 2',
        }, {
          items: [],
          data: [],
          name: 'group 3',
        }],
        groupOrientation: 'vertical',
        className: 'dx-scheduler-group-column-count-three',
      }, {
        groups: [{
          items: [],
          data: [],
          name: 'group 1',
        }],
        groupOrientation: 'horizontal',
        className: 'dx-scheduler-group-row-count-one',
      }, {
        groups: [{
          items: [],
          data: [],
          name: 'group 1',
        }, {
          items: [],
          data: [],
          name: 'group 2',
        }],
        groupOrientation: 'horizontal',
        className: 'dx-scheduler-group-row-count-two',
      }, {
        groups: [{
          items: [],
          data: [],
          name: 'group 1',
        }, {
          items: [],
          data: [],
          name: 'group 2',
        }, {
          items: [],
          data: [],
          name: 'group 3',
        }],
        groupOrientation: 'horizontal',
        className: 'dx-scheduler-group-row-count-three',
      }].forEach(({ groups: currentGroups, groupOrientation, className }) => {
        it(`should call combineClasses with correct parameters when groups count is ${currentGroups.length} and groupOrientation is ${groupOrientation}`, () => {
          (isVerticalGroupingApplied as any).mockImplementation(() => groupOrientation === 'vertical');

          const layout = new LayoutBase({
            ...new LayoutBaseProps(),
            className: 'dx-scheduler-work-space-day',
            groups: currentGroups,
            groupOrientation,
          } as any);

          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          layout.classes;

          expect(combineClasses)
            .toBeCalledWith({
              'dx-scheduler-work-space-day': true,
              'dx-scheduler-work-space-count': false,
              'dx-scheduler-work-space-odd-cells': false,
              'dx-scheduler-work-space-all-day-collapsed': false,
              'dx-scheduler-work-space-all-day': false,
              'dx-scheduler-work-space-group-by-date': false,
              'dx-scheduler-work-space-grouped': true,
              'dx-scheduler-work-space-vertical-grouped': groupOrientation === 'vertical',
              'dx-scheduler-group-row-count-one': false,
              'dx-scheduler-group-row-count-two': false,
              'dx-scheduler-group-row-count-three': false,
              'dx-scheduler-group-column-count-one': false,
              'dx-scheduler-group-column-count-two': false,
              'dx-scheduler-group-column-count-three': false,
              'dx-scheduler-work-space': true,
              [className]: true,
            });
        });
      });
    });
  });
});
