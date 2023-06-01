import { shallow } from 'enzyme';
import React from 'react';
import { Scrollable } from '../../../../scroll_view/scrollable';
import { Widget } from '../../../../common/widget';
import {
  CrossScrollingLayout,
  viewFunction as LayoutView,
} from '../cross_scrolling_layout';
import { GroupPanel } from '../group_panel/group_panel';
import { AllDayPanelLayout, AllDayPanelLayoutProps } from '../date_table/all_day_panel/layout';
import { AllDayPanelTitle } from '../date_table/all_day_panel/title';
import { HeaderPanelEmptyCell } from '../header_panel_empty_cell';
import { ScrollSemaphore } from '../../../utils/semaphore/scrollSemaphore';
import { HeaderPanelLayout } from '../header_panel/layout';
import { TimelineHeaderPanelLayout } from '../../timeline/header_panel/layout';
import { DateTableLayoutBase, DateTableLayoutProps } from '../date_table/layout';
import { MonthDateTableLayout } from '../../month/date_table/layout';
import { TimePanelTableLayout } from '../time_panel/layout';
import { AppointmentLayout } from '../../../appointment/layout';

describe('OrdinaryLayout', () => {
  const viewData = {
    groupedData: [{
      allDayPane: [],
      dateTable: [{
        cells: [
          {
            startDate: new Date(2020, 6, 9),
            endDate: new Date(2020, 6, 10),
            today: true,
            groups: 1,
            key: 0,
          },
          {
            startDate: new Date(2020, 6, 10),
            endDate: new Date(2020, 6, 11),
            today: false,
            groups: 2,
            key: 1,
          },
        ],
        key: 0,
      }, {
        cells: [
          {
            startDate: new Date(2020, 6, 11),
            endDate: new Date(2020, 6, 12),
            today: false,
            groups: 3,
            key: 0,
          },
          {
            startDate: new Date(2020, 6, 12),
            endDate: new Date(2020, 6, 13),
            today: false,
            groups: 4,
            key: 1,
          },
        ],
        key: 1,
      }],
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
    const commonProps = {
      isUseTimelineHeader: false,
      isUseMonthDateTable: false,
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
    const renderWithJSX = (viewModel) => shallow(
      <LayoutView
        {...viewModel}
        props={{
          ...commonProps,
          className: 'custom-classes',
          widgetElementRef: 'widgetElementRef',
        } as any}
      />,
    );

    it('should render widget as root component', () => {
      const layout = renderWithJSX({
        props: {
          className: 'custom-classes',
          widgetElementRef: 'widgetElementRef',
        },
      });

      expect(layout.is(Widget))
        .toBe(true);
      expect(layout.prop('className'))
        .toBe('custom-classes');
      expect(layout.prop('rootElementRef'))
        .toBe('widgetElementRef');
    });

    it('should render heder panel container', () => {
      const layout = render({});

      expect(layout.find('.dx-scheduler-header-panel-container').exists())
        .toBe(true);
    });

    it('should render correct content inside header panel container', () => {
      const layout = render({
        props: {
          headerEmptyCellWidth: 132,
          isStandaloneAllDayPanel: true,
        },
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

    it('should render header scrollable and pass correct props to it', () => {
      const onHeaderScroll = jest.fn();
      const layout = render({ onHeaderScroll });

      const headerScrollable = layout.find(Scrollable).at(0);

      expect(headerScrollable.props())
        .toEqual({
          classes: 'dx-scheduler-header-scrollable',
          useKeyboard: false,
          showScrollbar: 'never',
          direction: 'horizontal',
          useNative: false,
          bounceEnabled: false,
          children: expect.anything(),
          onScroll: onHeaderScroll,
        });
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
      const layout = render({ props, headerStyles: { width: 324 } });

      const headerTable = layout.find('.dx-scheduler-header-panel');

      expect(headerTable.exists())
        .toBe(true);
      expect(headerTable.is('table'))
        .toBe(true);
      expect(headerTable.prop('style'))
        .toEqual({ width: 324 });

      const headerPanel = headerTable.childAt(0);

      expect(headerPanel.exists())
        .toBe(true);
      expect(headerPanel.is(HeaderPanelLayout))
        .toBe(true);
      expect(headerPanel.props())
        .toEqual(props);
    });

    it('should render TimelineHeaderPanel', () => {
      const props = {
        dateHeaderData,
        groupPanelData: {
          groupPanelItems: [],
          baseColSpan: 34,
        },
        isRenderDateHeader: true,
        isUseTimelineHeader: true,
      };
      const layout = render({ props, headerStyles: { width: 324 } });

      const headerPanel = layout.find(TimelineHeaderPanelLayout);

      expect(headerPanel.exists())
        .toBe(true);
    });

    it('should render date-table scrollable and pass correct props to it', () => {
      const onDateTableScroll = jest.fn();
      const layout = render({
        props: { scrollingDirection: 'vertical' },
        onDateTableScroll,

      });

      const scrollable = layout.find(Scrollable).at(2);

      expect(scrollable.props())
        .toEqual({
          useKeyboard: false,
          bounceEnabled: false,
          classes: 'dx-scheduler-date-table-scrollable',
          children: expect.anything(),
          direction: 'both',
          onScroll: onDateTableScroll,
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
          tablesWidth: 543,
        },
      });

      const dateTable = layout.find(DateTableLayoutBase);

      expect(dateTable.exists())
        .toBe(true);
      expect(dateTable.props())
        .toEqual({
          ...new DateTableLayoutProps(),
          ...props,
          tableRef: 'dateTableRef',
          width: 543,
        });
    });

    it('should render month date-table', () => {
      const layout = render({
        props: {
          isUseMonthDateTable: true,
        },
      });

      const dateTable = layout.find(MonthDateTableLayout);

      expect(dateTable.exists())
        .toBe(true);
    });

    it('should render date-table scrollable content', () => {
      const layout = render({});

      const scrollable = layout.find(Scrollable).at(2);

      expect(scrollable.children().length)
        .toBe(1);
      expect(scrollable.childAt(0).hasClass('dx-scheduler-date-table-scrollable-content'))
        .toBe(true);
    });

    it('should render side-bar scrollable', () => {
      const onSideBarScroll = jest.fn();
      const layout = render({
        onSideBarScroll,
      });

      const scrollable = layout.find(Scrollable).at(1);

      expect(scrollable.props())
        .toEqual({
          classes: 'dx-scheduler-sidebar-scrollable',
          useKeyboard: false,
          showScrollbar: 'never',
          direction: 'vertical',
          useNative: false,
          bounceEnabled: false,
          children: expect.anything(),
          onScroll: onSideBarScroll,
        });
    });

    it('should render side-bar scrollable content', () => {
      const layout = render({});

      expect(layout.find('.dx-scheduler-side-bar-scrollable-content').exists())
        .toBe(true);
    });

    it('should not render time panel and group panel', () => {
      const layout = render({});

      const scrollable = layout.find(Scrollable).at(1);

      expect(scrollable.children().length)
        .toBe(1);
      expect(scrollable.childAt(0).children().length)
        .toBe(0);
    });

    it('should render time panel', () => {
      const timePanelRef = React.createRef();
      const props = {
        timeCellTemplate: () => {},
        groupOrientation: 'vertical',
        timePanelData,
      };

      const layout = render({
        props: {
          isRenderTimePanel: true,
          timePanelRef,
          ...props,
        },
      });

      const scrollable = layout.find(Scrollable).at(1);
      const scrollableContent = scrollable.childAt(0);

      expect(scrollableContent.children().length)
        .toBe(1);

      const timePanel = scrollableContent.childAt(0);

      expect(timePanel.is(TimePanelTableLayout))
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
        isRenderGroupPanel: true,
        groupPanelHeight: 497,
        groupPanelRef,
      };
      const layout = render({
        props,
      });

      const scrollable = layout.find(Scrollable).at(1);
      const scrollableContent = scrollable.childAt(0);

      expect(scrollableContent.children().length)
        .toBe(1);

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
          isStandaloneAllDayPanel: true,
          tablesWidth: 321,
        },
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
          width: 321,
        });
    });

    it('should render appointments', () => {
      const layout = render({});

      expect(layout.find(AppointmentLayout).exists())
        .toBe(true);
    });

    it('should render flex-container for scrollables', () => {
      const layout = render({});

      const container = layout.find('.dx-scheduler-work-space-flex-container');

      expect(container.exists())
        .toBe(true);
      expect(container.childAt(0).prop('classes'))
        .toBe('dx-scheduler-sidebar-scrollable');
      expect(container.childAt(1).prop('classes'))
        .toBe('dx-scheduler-date-table-scrollable');
    });
  });

  describe('Behaviour', () => {
    describe('Methods', () => {
      describe('onDateTableScroll', () => {
        it('should call scrollTo of header and side-bar scrollables', () => {
          const onScroll = jest.fn();
          const layout = new CrossScrollingLayout({
            onScroll,
          } as any);

          const sideBarScrollTo = jest.fn();
          const headerScrollTo = jest.fn();

          const sideBarScrollable = {
            current: {
              scrollTo: sideBarScrollTo,
            },
          };
          const headerScrollable = {
            current: {
              scrollTo: headerScrollTo,
            },
          };

          layout.sideBarScrollableRef = sideBarScrollable as any;
          layout.headerScrollableRef = headerScrollable as any;

          layout.onDateTableScroll({ scrollOffset: { left: 50, top: 100 } });

          expect(sideBarScrollTo)
            .toBeCalledWith({
              top: 100,
            });
          expect(headerScrollTo)
            .toBeCalledWith({
              left: 50,
            });
          expect(onScroll)
            .toHaveBeenCalledTimes(1);
        });
      });

      describe('onHeaderScroll', () => {
        it('should call scrollTo of date-table scrollable', () => {
          const layout = new CrossScrollingLayout({} as any);

          const dateTableScrollTo = jest.fn();

          const dateTableScrollable = {
            current: {
              scrollTo: dateTableScrollTo,
            },
          };

          layout.dateTableScrollableRef = dateTableScrollable as any;

          layout.onHeaderScroll({ scrollOffset: { left: 50, top: 0 } });

          expect(dateTableScrollTo)
            .toBeCalledWith({
              left: 50,
            });
        });
      });

      describe('onSideBarScroll', () => {
        it('should call scrollTo of dateTable scrollable', () => {
          const layout = new CrossScrollingLayout({} as any);

          const dateTableScrollTo = jest.fn();

          const dateTableScrollable = {
            current: {
              scrollTo: dateTableScrollTo,
            },
          };

          layout.dateTableScrollableRef = dateTableScrollable as any;

          layout.onSideBarScroll({ scrollOffset: { left: 50, top: 100 } });

          expect(dateTableScrollTo)
            .toBeCalledWith({
              top: 100,
            });
        });
      });

      describe('getScrollableWidth', () => {
        it('should return date-table scrollable\'s width', () => {
          const layout = new CrossScrollingLayout({} as any);

          layout.dateTableScrollableRef = {
            current: {
              container: () => ({
                getBoundingClientRect: () => ({ width: 324 }),
              }),
            },
          } as any;

          expect(layout.getScrollableWidth())
            .toBe(324);
        });
      });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('Semaphores', () => {
        it('should initialize semaphores correctly', () => {
          const layout = new CrossScrollingLayout({} as any);

          expect(layout.dateTableSemaphore instanceof ScrollSemaphore)
            .toBe(true);
          expect(layout.sideBarSemaphore instanceof ScrollSemaphore)
            .toBe(true);
          expect(layout.headerSemaphore instanceof ScrollSemaphore)
            .toBe(true);
        });
      });

      describe('headerStyles', () => {
        it('should generate correct styles', () => {
          const layout = new CrossScrollingLayout({
            tablesWidth: 345,
          } as any);

          expect(layout.headerStyles)
            .toEqual({ width: 345 });
        });
      });
    });
  });
});
