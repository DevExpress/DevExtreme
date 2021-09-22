import { shallow, mount } from 'enzyme';
import React from 'react';
import { Scrollable } from '../../../../scroll_view/scrollable';
import { Widget } from '../../../../common/widget';
import {
  OrdinaryLayout,
  OrdinaryLayoutProps,
  viewFunction as LayoutView,
} from '../ordinary_layout';
import { GroupPanel } from '../group_panel/group_panel';
import { AllDayPanelLayout, AllDayPanelLayoutProps } from '../date_table/all_day_panel/layout';
import { AllDayPanelTitle } from '../date_table/all_day_panel/title';
import { combineClasses } from '../../../../../utils/combine_classes';
import { isVerticalGroupingApplied } from '../../utils';
import { HeaderPanelEmptyCell } from '../header_panel_empty_cell';

jest.mock('../../../../../utils/combine_classes', () => ({
  combineClasses: jest.fn(),
}));
jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  isVerticalGroupingApplied: jest.fn(),
}));

describe('OrdinaryLayout', () => {
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
      isRenderHeaderEmptyCell: true,
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

    it('should render heder panel container', () => {
      const layout = render({});

      expect(layout.find('.dx-scheduler-header-panel-container').exists())
        .toBe(true);
    });

    it('should render correct content inside headr panel container', () => {
      const layout = render({
        headerEmptyCellWidth: 132,
        isStandaloneAllDayPanel: true,
      });

      const headerPanelContainer = layout.find('.dx-scheduler-header-panel-container');

      expect(headerPanelContainer.children().length)
        .toBe(2);

      const headerEmptyCell = headerPanelContainer.childAt(0);
      expect(headerEmptyCell.is(HeaderPanelEmptyCell))
        .toBe(true);
      expect(headerEmptyCell.props())
        .toEqual({
          width: 132,
          isRenderAllDayTitle: true,
        });

      expect(headerPanelContainer.childAt(1).hasClass('dx-scheduler-header-tables-container'))
        .toBe(true);
    });

    it('should not render header empty cell if isRenderHeaderEmptyCell is false', () => {
      const layout = render({
        props: {
          isRenderHeaderEmptyCell: false,
        },
      });

      expect(layout.find('.dx-scheduler-header-panel-empty-cell').exists())
        .toBe(false);
    });

    it('should render HeaderPanel and pass to it correct props', () => {
      const props = {
        dateHeaderData,
        groupPanelData: {
          groupPanelItems: [],
          baseColSpan: 34,
        },
        timeCellTemplate: () => null,
        dateCellTemplate: () => null,
        isRenderDateHeader: true,

        groupOrientation: 'horizontal',
        groupByDate: false,
        groups,
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
      const layout = render({
        props: { scrollingDirection: 'vertical' },
      });

      const scrollable = layout.find(Scrollable);

      expect(scrollable.props())
        .toEqual({
          useKeyboard: false,
          bounceEnabled: false,
          className: 'dx-scheduler-date-table-scrollable',
          children: expect.anything(),
          direction: 'vertical',
        });
    });

    it('should render date-table and pass to it correct props', () => {
      const props = {
        viewData,
        groupOrientation: 'horizontal',
        dataCellTemplate: () => null,
      };
      const layout = render({
        props: {
          ...props,
          dateTableRef: 'dateTableRef',
        },
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

    it('should render date-table scrollable content', () => {
      const layout = render({});

      const scrollable = layout.find(Scrollable);

      expect(scrollable.children().length)
        .toBe(1);
      expect(scrollable.childAt(0).hasClass('dx-scheduler-date-table-scrollable-content'))
        .toBe(true);
    });

    it('should not render time panel and group panel', () => {
      const layout = render({});

      const scrollable = layout.find(Scrollable);

      expect(scrollable.children().length)
        .toBe(1);
      expect(scrollable.childAt(0).childAt(0).hasClass('dx-scheduler-date-table-container'))
        .toBe(true);
    });

    it('should render time panel when it is passed as a prop', () => {
      const timePanelRef = React.createRef();
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
        timePanelRef,
      });

      const scrollable = layout.find(Scrollable);
      const scrollableContent = scrollable.childAt(0);

      expect(scrollableContent.children().length)
        .toBe(2);

      const timePanel = scrollableContent.childAt(0);

      expect(timePanel.is(timePanelTemplate))
        .toBe(true);
      expect(timePanel.props())
        .toEqual({
          ...props,
          tableRef: timePanelRef,
        });
    });

    it('should render group panel when isRenderGroupPanel is true', () => {
      const groupPanelRef = React.createRef();
      const resourceCellTemplate = () => null;
      const props = {
        groupOrientation: 'vertical',
        groupByDate: false,
        groups,
        resourceCellTemplate,
        groupPanelClassName: 'groupPanelClassName',
        groupPanelData: {
          groupPanelItems: [],
          baseColSpan: 34,
        },
      };
      const layout = render({
        isRenderGroupPanel: true,
        props,
        groupPanelHeight: 497,
        groupPanelRef,
      });

      const scrollable = layout.find(Scrollable);
      const scrollableContent = scrollable.childAt(0);

      expect(scrollableContent.children().length)
        .toBe(2);

      const groupPanel = scrollableContent.childAt(0);

      expect(groupPanel.is(GroupPanel))
        .toBe(true);
      expect(groupPanel.props())
        .toEqual({
          groupOrientation: 'vertical',
          groupByDate: false,
          groups,
          resourceCellTemplate,
          height: 497,
          className: 'groupPanelClassName',
          groupPanelData: {
            groupPanelItems: [],
            baseColSpan: 34,
          },
          elementRef: groupPanelRef,
        });
    });

    it('should not render all-day panel by default', () => {
      const layout = render({});

      expect(layout.find(AllDayPanelLayout).exists())
        .toBe(false);
      expect(layout.find(AllDayPanelTitle).exists())
        .toBe(false);
    });

    it('should render all-day panel when it is visible', () => {
      const dataCellTemplate = () => null;
      const layout = render({
        props: {
          dataCellTemplate,
          allDayPanelRef: 'allDayPanelRef',
        },
        isStandaloneAllDayPanel: true,
      });

      const allDayPanel = layout.find(AllDayPanelLayout);

      expect(allDayPanel.exists())
        .toBe(true);

      expect(allDayPanel.props())
        .toEqual({
          ...new AllDayPanelLayoutProps(),
          viewData,
          dataCellTemplate,
          tableRef: 'allDayPanelRef',
        });
    });

    it('should render appointments', () => {
      const layout = render({
        props: {
          appointments: <div className="appointments" />,
        },
      });

      expect(layout.find('.appointments').exists())
        .toBe(true);
    });
  });

  describe('Behaviour', () => {
    describe('Effects', () => {
      describe('groupPanelHeightEffect', () => {
        it('should set groupPanelHeight', () => {
          const layout = new OrdinaryLayout({
            dateTableRef: {
              current: {
                getBoundingClientRect: () => ({
                  height: 325,
                }),
              },
            },
          } as any);

          layout.groupPanelHeightEffect();

          expect(layout.groupPanelHeight)
            .toBe(325);
        });

        it('should work if tableRef was not initialized', () => {
          const layout = new OrdinaryLayout({
            dateTableRef: {
              current: null,
            },
          } as any);

          layout.groupPanelHeightEffect();

          expect(layout.groupPanelHeight)
            .toBe(undefined);
        });
      });

      describe('headerEmptyCellWidthEffect', () => {
        const timePanelRef = {
          current: {
            getBoundingClientRect: () => ({
              width: 100,
            }),
          },
        };
        const groupPanelRef = {
          current: {
            getBoundingClientRect: () => ({
              width: 160,
            }),
          },
        };
        const emptyRef = {
          current: null,
        };

        it('should work if refs are not initialized', () => {
          const layout = new OrdinaryLayout({} as any);

          layout.timePanelRef = emptyRef as any;
          layout.groupPanelRef = emptyRef as any;

          layout.headerEmptyCellWidthEffect();

          expect(layout.headerEmptyCellWidth)
            .toBe(0);
        });

        it('should work when group panel is present', () => {
          const layout = new OrdinaryLayout({} as any);

          layout.timePanelRef = emptyRef as any;
          layout.groupPanelRef = groupPanelRef as any;

          layout.headerEmptyCellWidthEffect();

          expect(layout.headerEmptyCellWidth)
            .toBe(160);
        });

        it('should work when time-panel is present', () => {
          const layout = new OrdinaryLayout({} as any);

          layout.timePanelRef = timePanelRef as any;
          layout.groupPanelRef = emptyRef as any;

          layout.headerEmptyCellWidthEffect();

          expect(layout.headerEmptyCellWidth)
            .toBe(100);
        });

        it('should work when both time-panel and grup-panel are present', () => {
          const layout = new OrdinaryLayout({} as any);

          layout.timePanelRef = timePanelRef as any;
          layout.groupPanelRef = groupPanelRef as any;

          layout.headerEmptyCellWidthEffect();

          expect(layout.headerEmptyCellWidth)
            .toBe(260);
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

          const layout = new OrdinaryLayout({
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

          const layout = new OrdinaryLayout({
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
        const layout = new OrdinaryLayout({
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

    describe('classes', () => {
      beforeEach(() => {
        (isVerticalGroupingApplied as any).mockImplementation(() => true);
      });

      afterEach(jest.resetAllMocks);

      it('should call combineClasses with correct parameters', () => {
        const layout = new OrdinaryLayout({
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
        const layout = new OrdinaryLayout({
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
        const layout = new OrdinaryLayout({
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

        const layout = new OrdinaryLayout({
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

        const layout = new OrdinaryLayout({
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

          const layout = new OrdinaryLayout({
            ...new OrdinaryLayoutProps(),
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
