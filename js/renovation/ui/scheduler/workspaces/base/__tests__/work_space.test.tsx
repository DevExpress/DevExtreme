import React, { createRef } from 'react';
import { mount, shallow } from 'enzyme';
import {
  clear, emit, EVENT,
} from '../../../../../test_utils/events_mock';
import { ViewDataGenerator } from '../../../../../../ui/scheduler/workspaces/view_model/view_data_generator';
import { DateHeaderDataGenerator } from '../../../../../../ui/scheduler/workspaces/view_model/date_header_data_generator';
import { TimePanelDataGenerator } from '../../../../../../ui/scheduler/workspaces/view_model/time_panel_data_generator';
import { formatWeekdayAndDay } from '../../../view_model/to_test/views/utils/base';
import { VERTICAL_GROUP_ORIENTATION } from '../../../consts';
import { OrdinaryLayout } from '../ordinary_layout';
import {
  viewFunction as WorkSpaceLayout,
  WorkSpace,
} from '../work_space';
import { WorkSpaceProps } from '../../props';
import * as ConfigUtils from '../work_space_config';
import { HeaderPanelLayout } from '../header_panel/layout';
import { DateTableLayoutBase } from '../date_table/layout';

import { combineClasses } from '../../../../../utils/combine_classes';
import * as Utils from '../../utils';
import { CrossScrollingLayout } from '../cross_scrolling_layout';
import { getDateTableWidth } from '../utils';

import { getWindow, setWindow } from '../../../../../../core/utils/window';
import * as subscribeUtils from '../../../../../utils/subscribe_to_event';
import { DATE_TABLE_CELL_CLASS, DATE_TABLE_ROW_CLASS } from '../../const';

jest.mock('../../../../../utils/combine_classes', () => ({
  combineClasses: jest.fn(),
}));
jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  getDateTableWidth: jest.fn(() => 1000),
}));
const isVerticalGroupingApplied = jest.spyOn(Utils, 'isVerticalGroupingApplied');
const isHorizontalGroupingApplied = jest.spyOn(Utils, 'isHorizontalGroupingApplied');
const subscribeToDXPointerDownEvent = jest.spyOn(subscribeUtils, 'subscribeToDXPointerDownEvent');
const subscribeToDXPointerMoveEvent = jest.spyOn(subscribeUtils, 'subscribeToDXPointerMoveEvent');

const mockSetViewOptions = jest.fn();
const mockCreateGroupedDataMapProvider = jest.fn();
const mockGetCellData = jest.fn();
const mockGetCellsByGroupIndexAndAllDay = jest.fn();
const mockViewDataProvider = {
  getCellCount: () => 7,
  setViewOptions: mockSetViewOptions,
  createGroupedDataMapProvider: mockCreateGroupedDataMapProvider,
  getCellData: mockGetCellData,
  getCellsByGroupIndexAndAllDay: mockGetCellsByGroupIndexAndAllDay,
};
jest.mock('../../../../../../ui/scheduler/workspaces/view_model/view_data_provider', () => jest.fn().mockImplementation(() => mockViewDataProvider));

const getViewRenderConfigByType = jest.spyOn(ConfigUtils, 'getViewRenderConfigByType');

describe('WorkSpace', () => {
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
      color: 'red',
    }, {
      text: 'Resource 2',
      id: 1,
      color: 'green',
    }],
    items: [{
      text: 'Resource 1',
      id: 0,
      color: 'red',
    }, {
      text: 'Resource 2',
      id: 1,
      color: 'green',
    }],
  }];

  describe('Render', () => {
    const renderConfig = {
      className: 'custom',
      isRenderDateHeader: true,
      scrollingDirection: 'vertical',
      groupPanelClassName: 'dx-scheduler-group-table',
      isCreateCrossScrolling: false,
      isUseMonthDateTable: true,
      isUseTimelineHeader: false,
      isRenderTimePanel: false,
    };

    const renderComponent = (viewModel) => shallow(
      <WorkSpaceLayout
        renderConfig={renderConfig}
        {...viewModel}
      />,
    );

    it('should pass correct props to the root component', () => {
      const props = {
        dataCellTemplate: () => null,
        dateCellTemplate: () => null,
        timeCellTemplate: () => null,
        resourceCellTemplate: () => null,

        groups,
        intervalCount: 1,
      };
      const onScrollableScroll = jest.fn();

      const viewModel = {
        dateHeaderData,
        viewData,
        timePanelData,
        isAllDayPanelVisible: true,
        isRenderHeaderEmptyCell: true,
        groupPanelData: {
          baseColSpan: 5,
          groupPanelItems: [],
        },
        classes: 'custom-classes',
        groupPanelHeight: 500,
        headerEmptyCellWidth: 300,
        tablesWidth: 1900,

        timePanelRef: 'timePanelRef',
        groupPanelRef: 'groupPanelRef',
        dateTableRef: 'dateTableRef',
        allDayPanelRef: 'allDayPanelRef',
        groupOrientation: VERTICAL_GROUP_ORIENTATION,
        isGroupedByDate: false,
        onScrollableScroll,
        widgetElementRef: 'widgetElementRef',
      };

      const workSpace = renderComponent({
        ...viewModel,
        props: {
          ...new WorkSpaceProps(),
          ...props,
          allDayPanelExpanded: false,
        },
      });

      expect(workSpace.is(OrdinaryLayout))
        .toBe(true);
      expect(workSpace.props())
        .toEqual({
          ...props,
          isAllDayPanelCollapsed: true,
          isAllDayPanelVisible: true,
          isRenderHeaderEmptyCell: true,
          dateHeaderData,
          viewData,
          timePanelData,
          groupPanelData: {
            baseColSpan: 5,
            groupPanelItems: [],
          },
          isRenderDateHeader: true,
          scrollingDirection: 'vertical',
          groupPanelClassName: 'dx-scheduler-group-table',
          isUseMonthDateTable: true,
          isUseTimelineHeader: false,
          isRenderTimePanel: false,
          className: 'custom-classes',
          groupPanelHeight: 500,
          headerEmptyCellWidth: 300,
          timePanelRef: 'timePanelRef',
          groupPanelRef: 'groupPanelRef',
          dateTableRef: 'dateTableRef',
          allDayPanelRef: 'allDayPanelRef',
          groupOrientation: VERTICAL_GROUP_ORIENTATION,
          tablesWidth: 1900,
          groupByDate: false,
          onScroll: onScrollableScroll,
          widgetElementRef: 'widgetElementRef',
        });
    });

    it('should render cross-scrolling layout when necessary', () => {
      const props = {
        dataCellTemplate: () => null,
        dateCellTemplate: () => null,
        timeCellTemplate: () => null,
        resourceCellTemplate: () => null,

        groups,
        intervalCount: 1,
      };
      const onScrollableScroll = jest.fn();

      const viewModel = {
        dateHeaderData,
        viewData,
        timePanelData,
        isAllDayPanelVisible: true,
        isRenderHeaderEmptyCell: true,
        groupPanelData: {
          baseColSpan: 5,
          groupPanelItems: [],
        },
        groupPanelHeight: 500,
        headerEmptyCellWidth: 300,
        tablesWidth: 1900,
        groupOrientation: VERTICAL_GROUP_ORIENTATION,
        isGroupedByDate: false,
        onScrollableScroll,
      };

      const workSpace = renderComponent({
        ...viewModel,
        props: {
          ...new WorkSpaceProps(),
          ...props,
          allDayPanelExpanded: false,
        },
        renderConfig: {
          ...renderConfig,
          isCreateCrossScrolling: true,
        },
      });

      expect(workSpace.is(CrossScrollingLayout))
        .toBe(true);
    });
  });

  describe('Behaviour', () => {
    describe('methods', () => {
      describe('onScrollableScroll', () => {
        it('should update virtual scrolling data', () => {
          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            type: 'week',
            currentDate: new Date(2021, 10, 9),
            startViewDate: new Date(2021, 10, 7),
            scrolling: { mode: 'virtual' },
            intervalCount: 25,
            schedulerHeight: 500,
            schedulerWidth: 500,
          } as any);

          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          workSpace.correctedVirtualScrollingState;

          workSpace.virtualScrollingData = {
            state: {
              startCellIndex: 0,
              startRowIndex: 0,
            },
            sizes: {},
          } as any;

          workSpace.onScrollableScroll({
            scrollOffset: {
              top: 1000,
              left: 2000,
            },
          });

          expect(workSpace.virtualScrollingData)
            .toEqual({
              sizes: {},
              state: {
                bottomVirtualRowHeight: 950,
                cellCount: 8,
                cellWidth: 75,
                leftVirtualCellWidth: 1800,
                rightVirtualCellWidth: 10725,
                rowCount: 12,
                startCellIndex: 24,
                startIndex: 17,
                startRowIndex: 17,
                topVirtualRowHeight: 850,
              },
            });
        });

        it('should not update virtual scrolling data when it is not necessary', () => {
          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            type: 'week',
            currentDate: new Date(2021, 10, 9),
            startViewDate: new Date(2021, 10, 7),
            scrolling: { mode: 'virtual' },
            intervalCount: 25,
          } as any);

          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          workSpace.correctedVirtualScrollingState;

          const data: any = {
            sizes: {},
            state: {
              bottomVirtualRowHeight: 950,
              cellCount: 8,
              cellWidth: 75,
              leftVirtualCellWidth: 1800,
              rightVirtualCellWidth: 10725,
              rowCount: 12,
              startCellIndex: 24,
              startIndex: 17,
              startRowIndex: 17,
              topVirtualRowHeight: 850,
            },
          };

          workSpace.virtualScrollingData = data;

          workSpace.onScrollableScroll({
            scrollOffset: {
              top: 1000,
              left: 2000,
            },
          });

          expect(workSpace.virtualScrollingData)
            .toBe(data);
        });

        it('should not update virtual scrolling data when standard scrolling is used', () => {
          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            type: 'week',
            currentDate: new Date(2021, 10, 9),
            startViewDate: new Date(2021, 10, 7),
            scrolling: { mode: 'standard' },
            intervalCount: 25,
          } as any);

          workSpace.onScrollableScroll({
            scrollOffset: {
              top: 1000,
              left: 2000,
            },
          });

          expect(workSpace.virtualScrollingData)
            .toBe(undefined);
        });
      });

      describe('onWindowScroll', () => {
        it('should update virtual scrolling data', () => {
          const originalWindow = getWindow();

          try {
            setWindow({
              innerHeight: 500,
              innerWidth: 500,
            }, true);

            const workSpace = new WorkSpace({
              ...new WorkSpaceProps(),
              type: 'week',
              currentDate: new Date(2021, 10, 9),
              startViewDate: new Date(2021, 10, 7),
              scrolling: { mode: 'virtual' },
              intervalCount: 25,
              schedulerHeight: 500,
              schedulerWidth: 500,
            } as any);

            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            workSpace.correctedVirtualScrollingState;

            workSpace.virtualScrollingData = {
              state: {
                startCellIndex: 0,
                startRowIndex: 0,
              },
              sizes: {},
            } as any;

            setWindow({
              innerHeight: 500,
              innerWidth: 500,
              scrollX: 2000,
              scrollY: 1000,
            }, true);

            workSpace.onWindowScroll();

            expect(workSpace.virtualScrollingData)
              .toEqual({
                sizes: {},
                state: {
                  bottomVirtualRowHeight: 950,
                  cellCount: 8,
                  cellWidth: 75,
                  leftVirtualCellWidth: 1800,
                  rightVirtualCellWidth: 10725,
                  rowCount: 12,
                  startCellIndex: 24,
                  startIndex: 17,
                  startRowIndex: 17,
                  topVirtualRowHeight: 850,
                },
              });
          } finally {
            setWindow(originalWindow, true);
          }
        });

        it('should not update virtual scrolling data when it is not necessary', () => {
          const originalWindow = getWindow();

          try {
            setWindow({
              innerHeight: 500,
              innerWidth: 500,
            }, true);

            const workSpace = new WorkSpace({
              ...new WorkSpaceProps(),
              type: 'week',
              currentDate: new Date(2021, 10, 9),
              startViewDate: new Date(2021, 10, 7),
              scrolling: { mode: 'virtual' },
              intervalCount: 25,
            } as any);

            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            workSpace.correctedVirtualScrollingState;

            const data: any = {
              sizes: {},
              state: {
                bottomVirtualRowHeight: 950,
                cellCount: 8,
                cellWidth: 75,
                leftVirtualCellWidth: 1800,
                rightVirtualCellWidth: 10725,
                rowCount: 12,
                startCellIndex: 24,
                startIndex: 17,
                startRowIndex: 17,
                topVirtualRowHeight: 850,
              },
            };

            workSpace.virtualScrollingData = data;

            setWindow({
              innerHeight: 500,
              innerWidth: 500,
              scrollX: 2000,
              scrollY: 1000,
            }, true);

            workSpace.onWindowScroll();

            expect(workSpace.virtualScrollingData)
              .toBe(data);
          } finally {
            setWindow(originalWindow, true);
          }
        });
      });

      describe('onPointerDown', () => {
        it('should be ignored if cell is not defined', () => {
          const ref: any = createRef();
          mount(<div ref={ref} />);
          const eventMock: any = {
            type: 'mouse',
            target: ref.current,
            button: 0,
          };

          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            currentDate: new Date(2021, 10, 20),
            startViewDate: new Date(2021, 10, 20),
          });

          workSpace.onPointerDown(eventMock);

          expect(workSpace.cellsSelectionState)
            .toBe(null);
        });

        it('should be ignored if it is not a mouse event', () => {
          const ref: any = createRef();
          mount(<div ref={ref} className={DATE_TABLE_CELL_CLASS} />);
          const eventMock: any = {
            type: 'touch',
            target: ref.current,
            button: 0,
          };

          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            currentDate: new Date(2021, 10, 20),
            startViewDate: new Date(2021, 10, 20),
          });

          workSpace.onPointerDown(eventMock);

          expect(workSpace.cellsSelectionState)
            .toBe(null);
        });

        it('should be ignored if it is not a left mouse click', () => {
          const ref: any = createRef();
          mount(<div ref={ref} className={DATE_TABLE_CELL_CLASS} />);
          const eventMock: any = {
            type: 'mouse',
            target: ref.current,
            button: 2,
          };

          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            currentDate: new Date(2021, 10, 20),
            startViewDate: new Date(2021, 10, 20),
          });

          workSpace.onPointerDown(eventMock);

          expect(workSpace.cellsSelectionState)
            .toBe(null);
        });

        it('should work correctly', () => {
          const ref: any = createRef();
          mount(
            <div>
              <div className={DATE_TABLE_ROW_CLASS}>
                <div ref={ref} className={DATE_TABLE_CELL_CLASS} />
              </div>
            </div>,
          );
          const eventMock: any = {
            type: 'mouse',
            target: ref.current,
            button: 0,
          };

          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            currentDate: new Date(2021, 10, 20),
            startViewDate: new Date(2021, 10, 20),
          });

          mockGetCellData.mockImplementationOnce(() => ({
            startDate: new Date(2021, 10, 20),
            index: 0,
            groupIndex: 0,
          }));
          workSpace.onPointerDown(eventMock);

          expect(workSpace.cellsSelectionState)
            .toEqual({
              selectedCells: [{
                startDate: new Date(2021, 10, 20),
                index: 0,
                groupIndex: 0,
              }],
              focusedCell: {
                position: {
                  columnIndex: 0,
                  rowIndex: 0,
                },
                cellData: {
                  startDate: new Date(2021, 10, 20),
                  index: 0,
                  groupIndex: 0,
                },
              },
              firstSelectedCell: {
                startDate: new Date(2021, 10, 20),
                index: 0,
                groupIndex: 0,
              },
            });
        });
      });

      describe('omPointerMove', () => {
        it('should be ignored if cell is not defined', () => {
          const ref: any = createRef();
          mount(<div ref={ref} />);
          const eventMock: any = {
            type: 'mouse',
            target: ref.current,
            button: 0,
          };

          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            currentDate: new Date(2021, 10, 20),
            startViewDate: new Date(2021, 10, 20),
          });

          workSpace.onPointerMove(eventMock);

          expect(workSpace.cellsSelectionState)
            .toBe(null);
        });

        it('should be ignored if isPointerDonw is false', () => {
          const ref: any = createRef();
          mount(<div ref={ref} className={DATE_TABLE_CELL_CLASS} />);
          const eventMock: any = {
            type: 'mouse',
            target: ref.current,
            button: 0,
          };

          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            currentDate: new Date(2021, 10, 20),
            startViewDate: new Date(2021, 10, 20),
          });

          workSpace.isPointerDown = false;
          workSpace.onPointerMove(eventMock);

          expect(workSpace.cellsSelectionState)
            .toBe(null);
        });

        it('should work correctly', () => {
          const ref: any = createRef();
          mount(
            <div>
              <div className={DATE_TABLE_ROW_CLASS}>
                <div ref={ref} className={DATE_TABLE_CELL_CLASS} />
              </div>
            </div>,
          );
          const eventMock: any = {
            type: 'mouse',
            target: ref.current,
            button: 0,
            preventDefault: jest.fn(),
            stopPropagation: jest.fn(),
          };

          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            currentDate: new Date(2021, 10, 20),
            startViewDate: new Date(2021, 10, 20),
          });

          workSpace.isPointerDown = true;
          workSpace.cellsSelectionState = {
            selectedCells: [{
              startDate: new Date(2021, 10, 21),
              index: 1,
              groupIndex: 0,
            }],
            focusedCell: {
              position: {
                columnIndex: 1,
                rowIndex: 0,
              },
              cellData: {
                startDate: new Date(2021, 10, 21),
                index: 1,
                groupIndex: 0,
              },
            },
            firstSelectedCell: {
              startDate: new Date(2021, 10, 21),
              index: 1,
              groupIndex: 0,
            },
          } as any;

          const cells = [[{
            startDate: new Date(2021, 10, 20),
            index: 0,
            groupIndex: 0,
          }, {
            startDate: new Date(2021, 10, 21),
            index: 1,
            groupIndex: 0,
          }]];

          mockGetCellData.mockImplementationOnce(() => cells[0][0]);
          mockGetCellsByGroupIndexAndAllDay.mockImplementationOnce(() => cells);

          workSpace.onPointerMove(eventMock);

          expect(eventMock.preventDefault)
            .toBeCalled();
          expect(eventMock.stopPropagation)
            .toBeCalled();

          expect(workSpace.cellsSelectionState)
            .toEqual({
              selectedCells: [{
                startDate: new Date(2021, 10, 20),
                index: 0,
                groupIndex: 0,
              }, {
                startDate: new Date(2021, 10, 21),
                index: 1,
                groupIndex: 0,
              }],
              focusedCell: {
                position: {
                  columnIndex: 0,
                  rowIndex: 0,
                },
                cellData: {
                  startDate: new Date(2021, 10, 20),
                  index: 0,
                  groupIndex: 0,
                },
              },
              firstSelectedCell: {
                startDate: new Date(2021, 10, 21),
                index: 1,
                groupIndex: 0,
              },
            });
        });

        it('should not save state if new cell is invalid', () => {
          const ref: any = createRef();
          mount(
            <div>
              <div className={DATE_TABLE_ROW_CLASS}>
                <div ref={ref} className={DATE_TABLE_CELL_CLASS} />
              </div>
            </div>,
          );
          const eventMock: any = {
            type: 'mouse',
            target: ref.current,
            button: 0,
            preventDefault: jest.fn(),
            stopPropagation: jest.fn(),
          };

          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            currentDate: new Date(2021, 10, 20),
            startViewDate: new Date(2021, 10, 20),
          });

          const defaultSelectionState = {
            selectedCells: [{
              startDate: new Date(2021, 10, 21),
              index: 1,
              groupIndex: 0,
            }],
            focusedCell: {
              position: {
                columnIndex: 1,
                rowIndex: 0,
              },
              cellData: {
                startDate: new Date(2021, 10, 21),
                index: 1,
                groupIndex: 0,
              },
            },
            firstSelectedCell: {
              startDate: new Date(2021, 10, 21),
              index: 1,
              groupIndex: 0,
            },
          } as any;

          workSpace.isPointerDown = true;
          workSpace.cellsSelectionState = defaultSelectionState;

          const cells = [[{
            startDate: new Date(2021, 10, 20),
            index: 0,
            groupIndex: 0,
          }, {
            startDate: new Date(2021, 10, 21),
            index: 1,
            groupIndex: 0,
          }, {
            startDate: new Date(2021, 10, 20),
            index: 0,
            groupIndex: 1,
          }, {
            startDate: new Date(2021, 10, 21),
            index: 1,
            groupIndex: 1,
          }]];

          mockGetCellData.mockImplementationOnce(() => cells[0][2]);
          mockGetCellsByGroupIndexAndAllDay.mockImplementationOnce(() => [cells[0].slice(0, 2)]);

          workSpace.onPointerMove(eventMock);

          expect(workSpace.cellsSelectionState)
            .toBe(defaultSelectionState);
        });

        it('should not save state if new focused cell is equal to the old one', () => {
          const ref: any = createRef();
          mount(
            <div>
              <div className={DATE_TABLE_ROW_CLASS}>
                <div ref={ref} className={DATE_TABLE_CELL_CLASS} />
              </div>
            </div>,
          );
          const eventMock: any = {
            type: 'mouse',
            target: ref.current,
            button: 0,
            preventDefault: jest.fn(),
            stopPropagation: jest.fn(),
          };

          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            currentDate: new Date(2021, 10, 20),
            startViewDate: new Date(2021, 10, 20),
          });

          const defaultSelectionState = {
            selectedCells: [{
              startDate: new Date(2021, 10, 21),
              index: 1,
              groupIndex: 0,
            }],
            focusedCell: {
              position: {
                columnIndex: 1,
                rowIndex: 0,
              },
              cellData: {
                startDate: new Date(2021, 10, 21),
                index: 1,
                groupIndex: 0,
              },
            },
            firstSelectedCell: {
              startDate: new Date(2021, 10, 21),
              index: 1,
              groupIndex: 0,
            },
          } as any;

          workSpace.isPointerDown = true;
          workSpace.cellsSelectionState = defaultSelectionState;

          const cells = [[{
            startDate: new Date(2021, 10, 20),
            index: 0,
            groupIndex: 0,
          }, {
            startDate: new Date(2021, 10, 21),
            index: 1,
            groupIndex: 0,
          }, {
            startDate: new Date(2021, 10, 20),
            index: 0,
            groupIndex: 1,
          }, {
            startDate: new Date(2021, 10, 21),
            index: 1,
            groupIndex: 1,
          }]];

          mockGetCellData.mockImplementationOnce(() => cells[0][1]);
          mockGetCellsByGroupIndexAndAllDay.mockImplementationOnce(() => [cells[0].slice(0, 2)]);

          workSpace.onPointerMove(eventMock);

          expect(workSpace.cellsSelectionState)
            .toBe(defaultSelectionState);
        });
      });

      describe('onPointerUp', () => {
        it('should set isPointerDown to false', () => {
          const workSpace = new WorkSpace({} as any);

          workSpace.isPointerDown = true;

          workSpace.onPointerUp({
            type: 'mouse',
            button: 0,
          } as any);

          expect(workSpace.isPointerDown)
            .toBe(false);
        });

        it('should ignore event if event is incorrect', () => {
          const workSpace = new WorkSpace({} as any);

          workSpace.isPointerDown = true;

          workSpace.onPointerUp({
            type: 'touch',
            button: 0,
          } as any);

          expect(workSpace.isPointerDown)
            .toBe(true);

          workSpace.onPointerUp({
            type: 'mouse',
            button: 2,
          } as any);

          expect(workSpace.isPointerDown)
            .toBe(true);
        });
      });
    });

    describe('Effects', () => {
      describe('onViewRendered', () => {
        const dateTableRefMock: any = {
          current: {
            getBoundingClientRect: () => ({
              left: 100, top: 100,
            }),
            querySelectorAll: () => [{
              getBoundingClientRect: () => ({
                left: 100, top: 100,
              }),
            }, {
              getBoundingClientRect: () => ({
                left: 150, top: 100,
              }),
            }, {
              getBoundingClientRect: () => ({
                left: 200, top: 100,
              }),
            }, {
              getBoundingClientRect: () => ({
                left: 250, top: 100,
              }),
            }, {
              getBoundingClientRect: () => ({
                left: 300, top: 100,
              }),
            }, {
              getBoundingClientRect: () => ({
                left: 350, top: 100,
              }),
            }, {
              getBoundingClientRect: () => ({
                left: 400, top: 100,
              }),
            }, {
              getBoundingClientRect: () => ({
                left: 100, top: 200,
              }),
            }, {
              getBoundingClientRect: () => ({
                left: 150, top: 200,
              }),
            }, {
              getBoundingClientRect: () => ({
                left: 200, top: 200,
              }),
            }, {
              getBoundingClientRect: () => ({
                left: 250, top: 200,
              }),
            }, {
              getBoundingClientRect: () => ({
                left: 300, top: 200,
              }),
            }, {
              getBoundingClientRect: () => ({
                left: 350, top: 200,
              }),
            }, {
              getBoundingClientRect: () => ({
                left: 400, top: 200,
              }),
            }],
          },
        };

        const allDayPanelRefMock: any = {
          current: {
            getBoundingClientRect: () => ({
              left: 100, top: 0,
            }),
            querySelectorAll: () => [{
              getBoundingClientRect: () => ({
                left: 100, top: 0,
              }),
            }, {
              getBoundingClientRect: () => ({
                left: 150, top: 0,
              }),
            }, {
              getBoundingClientRect: () => ({
                left: 200, top: 0,
              }),
            }, {
              getBoundingClientRect: () => ({
                left: 250, top: 0,
              }),
            }, {
              getBoundingClientRect: () => ({
                left: 300, top: 0,
              }),
            }, {
              getBoundingClientRect: () => ({
                left: 350, top: 0,
              }),
            }, {
              getBoundingClientRect: () => ({
                left: 400, top: 0,
              }),
            }],
          },
        };

        it('should call onViewRendered with correct parameters when all-day panel is not visible', () => {
          const onViewRendered = jest.fn();
          const currentDate = new Date(2021, 11, 26);

          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            onViewRendered,
            startDayHour: 0,
            endDayHour: 1,
            showAllDayPanel: false,
            currentDate,
            startViewDate: currentDate,
          });

          workSpace.dateTableRef = dateTableRefMock;
          workSpace.allDayPanelRef = { current: null } as any;
          workSpace.layoutRef = {
            current: {
              getScrollableWidth: () => 1000,
            },
          } as any;

          workSpace.onViewRendered();

          expect(onViewRendered)
            .toBeCalledTimes(1);
          expect(onViewRendered)
            .toBeCalledWith({
              viewDataProvider: mockViewDataProvider,
              cellsMetaData: {
                dateTableCellsMeta: [[{
                  left: 0, top: 0,
                }, {
                  left: 50, top: 0,
                }, {
                  left: 100, top: 0,
                }, {
                  left: 150, top: 0,
                }, {
                  left: 200, top: 0,
                }, {
                  left: 250, top: 0,
                }, {
                  left: 300, top: 0,
                }], [{
                  left: 0, top: 100,
                }, {
                  left: 50, top: 100,
                }, {
                  left: 100, top: 100,
                }, {
                  left: 150, top: 100,
                }, {
                  left: 200, top: 100,
                }, {
                  left: 250, top: 100,
                }, {
                  left: 300, top: 100,
                }]],
                allDayPanelCellsMeta: [],
              },
              viewDataProviderValidationOptions: {
                intervalCount: 1,
                currentDate,
                type: 'week',
                hoursInterval: 0.5,
                startDayHour: 0,
                endDayHour: 1,
                groups: [],
                groupOrientation: undefined,
                groupByDate: false,
                crossScrollingEnabled: false,
                firstDayOfWeek: 0,
                startDate: undefined,
                showAllDayPanel: false,
                allDayPanelExpanded: false,
                scrolling: { mode: 'standard' },
                cellDuration: 30,
              },
            });
        });

        it('should call onViewRendered with correct parameters when all-day panel is visible', () => {
          const onViewRendered = jest.fn();
          const currentDate = new Date(2021, 11, 26);

          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            onViewRendered,
            currentDate,
            startViewDate: currentDate,
            startDayHour: 0,
            endDayHour: 1,
            showAllDayPanel: true,
          });

          workSpace.dateTableRef = dateTableRefMock;
          workSpace.allDayPanelRef = allDayPanelRefMock;
          workSpace.layoutRef = {
            current: {
              getScrollableWidth: () => 1000,
            },
          } as any;

          workSpace.onViewRendered();

          expect(onViewRendered)
            .toBeCalledTimes(1);
          expect(onViewRendered)
            .toBeCalledWith({
              viewDataProvider: mockViewDataProvider,
              cellsMetaData: {
                dateTableCellsMeta: [[{
                  left: 0, top: 0,
                }, {
                  left: 50, top: 0,
                }, {
                  left: 100, top: 0,
                }, {
                  left: 150, top: 0,
                }, {
                  left: 200, top: 0,
                }, {
                  left: 250, top: 0,
                }, {
                  left: 300, top: 0,
                }], [{
                  left: 0, top: 100,
                }, {
                  left: 50, top: 100,
                }, {
                  left: 100, top: 100,
                }, {
                  left: 150, top: 100,
                }, {
                  left: 200, top: 100,
                }, {
                  left: 250, top: 100,
                }, {
                  left: 300, top: 100,
                }]],
                allDayPanelCellsMeta: [{
                  left: 0, top: 0,
                }, {
                  left: 50, top: 0,
                }, {
                  left: 100, top: 0,
                }, {
                  left: 150, top: 0,
                }, {
                  left: 200, top: 0,
                }, {
                  left: 250, top: 0,
                }, {
                  left: 300, top: 0,
                }],
              },
              viewDataProviderValidationOptions: {
                intervalCount: 1,
                currentDate,
                type: 'week',
                hoursInterval: 0.5,
                startDayHour: 0,
                endDayHour: 1,
                groups: [],
                groupOrientation: undefined,
                groupByDate: false,
                crossScrollingEnabled: false,
                firstDayOfWeek: 0,
                startDate: undefined,
                showAllDayPanel: true,
                allDayPanelExpanded: false,
                scrolling: { mode: 'standard' },
                cellDuration: 30,
              },
            });
        });

        it('should not call onViewRendered when crossScrolling is used and tablesWidth is not equal to real width', () => {
          const onViewRendered = jest.fn();

          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            onViewRendered,
            currentDate: new Date(2021, 11, 26),
            startViewDate: new Date(2021, 11, 26),
            startDayHour: 0,
            endDayHour: 1,
            showAllDayPanel: false,
            crossScrollingEnabled: true,
            type: 'week',
          });

          workSpace.tablesWidth = 500;
          workSpace.dateTableRef = dateTableRefMock;
          workSpace.allDayPanelRef = allDayPanelRefMock;
          workSpace.layoutRef = {
            current: {
              getScrollableWidth: () => 1000,
            },
          } as any;

          workSpace.onViewRendered();

          expect(onViewRendered)
            .toBeCalledTimes(0);
        });

        it('should call onViewRendered when crossScrolling is used and tablesWidth is not equal to real width', () => {
          const onViewRendered = jest.fn();

          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            onViewRendered,
            currentDate: new Date(2021, 11, 26),
            startViewDate: new Date(2021, 11, 26),
            startDayHour: 0,
            endDayHour: 1,
            showAllDayPanel: false,
            crossScrollingEnabled: true,
            type: 'week',
          });

          workSpace.tablesWidth = 1000;
          workSpace.dateTableRef = dateTableRefMock;
          workSpace.allDayPanelRef = allDayPanelRefMock;
          workSpace.layoutRef = {
            current: {
              getScrollableWidth: () => 1200,
            },
          } as any;

          workSpace.onViewRendered();

          expect(onViewRendered)
            .toBeCalledTimes(1);
        });
      });

      describe('onWindowScrollEffect', () => {
        it('shoud subscribe to window onScroll if height is not defined and virtual scrolling is used', () => {
          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            scrolling: { mode: 'virtual' },
            startViewDate: new Date(2021, 11, 26),
          });

          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          workSpace.correctedVirtualScrollingState;

          const onWindowScroll = jest.fn();
          workSpace.onWindowScroll = onWindowScroll;

          expect(workSpace.onWindowScrollEffect())
            .toStrictEqual(expect.any(Function));

          emit(EVENT.scroll);

          expect(onWindowScroll)
            .toBeCalled();
        });

        it('shoud not subscribe to window onScroll if height is defined and virtual scrolling is used', () => {
          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            scrolling: { mode: 'virtual' },
            schedulerHeight: 500,
            startViewDate: new Date(2021, 11, 26),
          });

          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          workSpace.correctedVirtualScrollingState;

          const onWindowScroll = jest.fn();
          workSpace.onWindowScroll = onWindowScroll;

          expect(workSpace.onWindowScrollEffect())
            .toBe(undefined);
        });

        it('shoud not subscribe to window onScroll if irtual scrolling is not used', () => {
          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            scrolling: { mode: 'standard' },
            startViewDate: new Date(2021, 11, 26),
          });

          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          workSpace.correctedVirtualScrollingState;

          const onWindowScroll = jest.fn();
          workSpace.onWindowScroll = onWindowScroll;

          expect(workSpace.onWindowScrollEffect())
            .toBe(undefined);
        });
      });

      describe('groupPanelHeightEffect', () => {
        it('should set groupPanelHeight', () => {
          const workSpace = new WorkSpace({} as any);

          workSpace.dateTableRef = {
            current: {
              getBoundingClientRect: () => ({
                height: 325,
              }),
            },
          } as any;
          workSpace.groupPanelHeightEffect();

          expect(workSpace.groupPanelHeight)
            .toBe(325);
        });

        it('should work if tableRef was not initialized', () => {
          const workSpace = new WorkSpace({} as any);

          workSpace.dateTableRef = {
            current: null,
          } as any;
          workSpace.groupPanelHeightEffect();

          expect(workSpace.groupPanelHeight)
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
          const workSpace = new WorkSpace({} as any);

          workSpace.timePanelRef = emptyRef as any;
          workSpace.groupPanelRef = emptyRef as any;

          workSpace.headerEmptyCellWidthEffect();

          expect(workSpace.headerEmptyCellWidth)
            .toBe(0);
        });

        it('should work when group panel is present', () => {
          const workSpace = new WorkSpace({} as any);

          workSpace.timePanelRef = emptyRef as any;
          workSpace.groupPanelRef = groupPanelRef as any;

          workSpace.headerEmptyCellWidthEffect();

          expect(workSpace.headerEmptyCellWidth)
            .toBe(160);
        });

        it('should work when time-panel is present', () => {
          const workSpace = new WorkSpace({} as any);

          workSpace.timePanelRef = timePanelRef as any;
          workSpace.groupPanelRef = emptyRef as any;

          workSpace.headerEmptyCellWidthEffect();

          expect(workSpace.headerEmptyCellWidth)
            .toBe(100);
        });

        it('should work when both time-panel and group-panel are present', () => {
          const workSpace = new WorkSpace({} as any);

          workSpace.timePanelRef = timePanelRef as any;
          workSpace.groupPanelRef = groupPanelRef as any;

          workSpace.headerEmptyCellWidthEffect();

          expect(workSpace.headerEmptyCellWidth)
            .toBe(260);
        });
      });

      describe('tablesWidthEffect', () => {
        it('should save tablesWidth into the state', () => {
          const currentDate = new Date(2021, 11, 26);
          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            crossScrollingEnabled: true,
            type: 'week',
            currentDate,
            startViewDate: currentDate,
            groups,
          } as any);

          workSpace.layoutRef = { current: { getScrollableWidth: () => 1500 } } as any;
          workSpace.dateTableRef = { current: {} } as any;

          workSpace.tablesWidthEffect();

          expect(workSpace.tablesWidth)
            .toBe(1000);
          expect(getDateTableWidth)
            .toHaveBeenCalledWith(
              1500,
              workSpace.dateTableRef.current,
              expect.anything(),
              {
                intervalCount: 1,
                currentDate,
                viewType: 'week',
                hoursInterval: 0.5,
                startDayHour: 0,
                endDayHour: 24,
                groups,
                groupOrientation: 'horizontal',
              },
            );
        });

        it('should not save tablesWidth into the state when cross-scrolling is not used', () => {
          const currentDate = new Date();
          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            crossScrollingEnabled: false,
            type: 'week',
            currentDate,
            groups,
          } as any);

          workSpace.layoutRef = { current: { getScrollableWidth: () => 1500 } } as any;
          workSpace.dateTableRef = { current: {} } as any;

          workSpace.tablesWidthEffect();

          expect(workSpace.tablesWidth)
            .toBe(undefined);
        });

        it('should not save tablesWidth into the state when timeline view is used', () => {
          const currentDate = new Date();
          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            crossScrollingEnabled: true,
            type: 'timelineMonth',
            currentDate,
            groups,
          } as any);

          workSpace.layoutRef = { current: { getScrollableWidth: () => 1500 } } as any;
          workSpace.dateTableRef = { current: {} } as any;

          workSpace.tablesWidthEffect();

          expect(workSpace.tablesWidth)
            .toBe(undefined);
        });
      });

      describe('virtualScrollingMetaDataEffect', () => {
        const dateTableRefMock: any = {
          current: {
            querySelector: () => ({
              getBoundingClientRect: () => ({
                height: 50,
                width: 75,
              }),
            }),
          },
        };
        const layoutRefMock: any = {
          current: {
            getScrollableWidth: () => 700,
          },
        };
        const widgetElementRefMock: any = {
          current: {
            getBoundingClientRect: () => ({
              height: 1000,
              width: 800,
            }),
          },
        };

        it('should calculate virtual scrolling state', () => {
          const originalWindow = getWindow();

          try {
            setWindow({
              innerHeight: 500,
              innerWidth: 500,
            }, true);

            const workSpace = new WorkSpace({
              ...new WorkSpaceProps(),
              type: 'week',
              currentDate: new Date(2021, 10, 9),
              startViewDate: new Date(2021, 10, 7),
              scrolling: { mode: 'virtual' },
              intervalCount: 2,
              schedulerHeight: 1000,
              schedulerWidth: 800,
            } as any);

            workSpace.layoutRef = layoutRefMock;
            workSpace.dateTableRef = dateTableRefMock;
            workSpace.widgetElementRef = widgetElementRefMock;

            workSpace.virtualScrollingMetaDataEffect();

            expect(workSpace.virtualScrollingData)
              .toEqual({
                sizes: {
                  cellHeight: 50,
                  cellWidth: 75,
                  scrollableWidth: 700,
                  viewHeight: 1000,
                  viewWidth: 800,
                  windowHeight: 500,
                  windowWidth: 500,
                },
                state: {
                  bottomVirtualRowHeight: 900,
                  cellCount: 14,
                  cellWidth: 75,
                  leftVirtualCellWidth: 0,
                  rightVirtualCellWidth: 0,
                  rowCount: 30,
                  startCellIndex: 0,
                  startIndex: 0,
                  startRowIndex: 0,
                  topVirtualRowHeight: 0,
                },
              });
          } finally {
            setWindow(originalWindow, true);
          }
        });

        it('should not recalculate virtual scrolling state', () => {
          const originalWindow = getWindow();

          try {
            setWindow({
              innerHeight: 500,
              innerWidth: 500,
            }, true);

            const workSpace = new WorkSpace({
              ...new WorkSpaceProps(),
              type: 'week',
              currentDate: new Date(2021, 10, 9),
              startViewDate: new Date(2021, 10, 7),
              scrolling: { mode: 'virtual' },
              intervalCount: 2,
              schedulerHeight: 1000,
              schedulerWidth: 800,
            } as any);

            workSpace.layoutRef = layoutRefMock;
            workSpace.dateTableRef = dateTableRefMock;
            workSpace.widgetElementRef = widgetElementRefMock;

            const data = {
              sizes: {
                cellHeight: 50,
                cellWidth: 75,
                scrollableWidth: 700,
                viewHeight: 1000,
                viewWidth: 800,
                windowHeight: 500,
                windowWidth: 500,
              },
              state: {
                bottomVirtualRowHeight: 900,
                cellCount: 14,
                cellWidth: 75,
                leftVirtualCellWidth: 0,
                rightVirtualCellWidth: 0,
                rowCount: 30,
                startCellIndex: 0,
                startIndex: 0,
                startRowIndex: 0,
                topVirtualRowHeight: 0,
              },
            };

            workSpace.virtualScrollingData = data;

            workSpace.virtualScrollingMetaDataEffect();

            expect(workSpace.virtualScrollingData)
              .toBe(data);
          } finally {
            setWindow(originalWindow, true);
          }
        });

        it('should recalculate virtual scrolling state when sizes are different', () => {
          const originalWindow = getWindow();

          try {
            setWindow({
              innerHeight: 500,
              innerWidth: 500,
            }, true);

            const workSpace = new WorkSpace({
              ...new WorkSpaceProps(),
              type: 'week',
              currentDate: new Date(2021, 10, 9),
              startViewDate: new Date(2021, 10, 7),
              scrolling: { mode: 'virtual' },
              intervalCount: 2,
              schedulerHeight: 1000,
              schedulerWidth: 800,
            } as any);

            workSpace.layoutRef = layoutRefMock;
            workSpace.dateTableRef = dateTableRefMock;
            workSpace.widgetElementRef = widgetElementRefMock;

            const data = {
              sizes: {
                cellHeight: 150,
                cellWidth: 100,
                scrollableWidth: 1700,
                viewHeight: 21000,
                viewWidth: 1800,
                windowHeight: 500,
                windowWidth: 500,
              },
              state: {
                bottomVirtualRowHeight: 900,
                cellCount: 14,
                cellWidth: 75,
                leftVirtualCellWidth: 0,
                rightVirtualCellWidth: 0,
                rowCount: 30,
                startCellIndex: 0,
                startIndex: 0,
                startRowIndex: 0,
                topVirtualRowHeight: 0,
              },
            };

            workSpace.virtualScrollingData = data;

            workSpace.virtualScrollingMetaDataEffect();

            expect(workSpace.virtualScrollingData)
              .not.toBe(data);
            expect(workSpace.virtualScrollingData)
              .toEqual({
                sizes: {
                  cellHeight: 50,
                  cellWidth: 75,
                  scrollableWidth: 700,
                  viewHeight: 1000,
                  viewWidth: 800,
                  windowHeight: 500,
                  windowWidth: 500,
                },
                state: {
                  bottomVirtualRowHeight: 900,
                  cellCount: 14,
                  cellWidth: 75,
                  leftVirtualCellWidth: 0,
                  rightVirtualCellWidth: 0,
                  rowCount: 30,
                  startCellIndex: 0,
                  startIndex: 0,
                  startRowIndex: 0,
                  topVirtualRowHeight: 0,
                },
              });
          } finally {
            setWindow(originalWindow, true);
          }
        });

        it('should recalculate virtual scrolling state when state changes', () => {
          const originalWindow = getWindow();

          try {
            setWindow({
              innerHeight: 500,
              innerWidth: 500,
            }, true);
            const workSpace = new WorkSpace({
              ...new WorkSpaceProps(),
              type: 'week',
              currentDate: new Date(2021, 10, 9),
              startViewDate: new Date(2021, 10, 7),
              scrolling: { mode: 'virtual' },
              intervalCount: 2,
              schedulerHeight: 1000,
              schedulerWidth: 800,
            } as any);

            workSpace.layoutRef = layoutRefMock;
            workSpace.dateTableRef = dateTableRefMock;
            workSpace.widgetElementRef = widgetElementRefMock;

            const data = {
              sizes: {
                cellHeight: 150,
                cellWidth: 100,
                scrollableWidth: 1700,
                viewHeight: 21000,
                viewWidth: 1800,
                windowHeight: 500,
                windowWidth: 500,
              },
              state: {
                bottomVirtualRowHeight: 1900,
                cellCount: 14,
                cellWidth: 75,
                leftVirtualCellWidth: 0,
                rightVirtualCellWidth: 0,
                rowCount: 30,
                startCellIndex: 0,
                startIndex: 0,
                startRowIndex: 0,
                topVirtualRowHeight: 0,
              },
            };

            workSpace.virtualScrollingData = data;

            workSpace.virtualScrollingMetaDataEffect();

            expect(workSpace.virtualScrollingData)
              .not.toBe(data);
            expect(workSpace.virtualScrollingData)
              .toEqual({
                sizes: {
                  cellHeight: 50,
                  cellWidth: 75,
                  scrollableWidth: 700,
                  viewHeight: 1000,
                  viewWidth: 800,
                  windowHeight: 500,
                  windowWidth: 500,
                },
                state: {
                  bottomVirtualRowHeight: 900,
                  cellCount: 14,
                  cellWidth: 75,
                  leftVirtualCellWidth: 0,
                  rightVirtualCellWidth: 0,
                  rowCount: 30,
                  startCellIndex: 0,
                  startIndex: 0,
                  startRowIndex: 0,
                  topVirtualRowHeight: 0,
                },
              });
          } finally {
            setWindow(originalWindow, true);
          }
        });

        it('should work with rtlEnabled', () => {
          const originalWindow = getWindow();

          try {
            setWindow({
              innerHeight: 500,
              innerWidth: 500,
            }, true);
            const workSpace = new WorkSpace({
              ...new WorkSpaceProps(),
              type: 'week',
              currentDate: new Date(2021, 10, 9),
              startViewDate: new Date(2021, 10, 7),
              scrolling: { mode: 'virtual' },
              intervalCount: 2,
              schedulerHeight: 1000,
              schedulerWidth: 800,
            } as any);

            workSpace.layoutRef = layoutRefMock;
            workSpace.dateTableRef = dateTableRefMock;
            workSpace.widgetElementRef = widgetElementRefMock;
            workSpace.config = { rtlEnabled: true };

            const data = {
              sizes: {
                cellHeight: 150,
                cellWidth: 100,
                scrollableWidth: 1700,
                viewHeight: 21000,
                viewWidth: 1800,
                windowHeight: 500,
                windowWidth: 500,
              },
              state: {
                bottomVirtualRowHeight: 1900,
                cellCount: 14,
                cellWidth: 75,
                leftVirtualCellWidth: 0,
                rightVirtualCellWidth: 0,
                rowCount: 30,
                startCellIndex: 0,
                startIndex: 0,
                startRowIndex: 0,
                topVirtualRowHeight: 0,
              },
            };

            workSpace.virtualScrollingData = data;

            workSpace.virtualScrollingMetaDataEffect();

            expect(workSpace.virtualScrollingData)
              .not.toBe(data);
            expect(workSpace.virtualScrollingData)
              .toEqual({
                sizes: {
                  cellHeight: 50,
                  cellWidth: 75,
                  scrollableWidth: 700,
                  viewHeight: 1000,
                  viewWidth: 800,
                  windowHeight: 500,
                  windowWidth: 500,
                },
                state: {
                  bottomVirtualRowHeight: 900,
                  cellCount: 14,
                  cellWidth: 75,
                  leftVirtualCellWidth: 0,
                  rightVirtualCellWidth: 0,
                  rowCount: 30,
                  startCellIndex: 0,
                  startIndex: 0,
                  startRowIndex: 0,
                  topVirtualRowHeight: 0,
                },
              });
          } finally {
            setWindow(originalWindow, true);
          }
        });
      });

      describe('pointerEventsEffect', () => {
        it('should register pointer down and pointer move events', () => {
          const widgetRef: any = createRef();
          mount(<div ref={widgetRef} />);

          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            currentDate: new Date(2021, 10, 30),
            startViewDate: new Date(2021, 10, 30),
          });

          workSpace.widgetElementRef = widgetRef;

          workSpace.onPointerDown = jest.fn();
          workSpace.onPointerMove = jest.fn();

          const dispose = workSpace.pointerEventsEffect();

          emit(EVENT.pointerDown);
          emit(EVENT.pointerMove);

          expect(workSpace.onPointerDown)
            .toBeCalledTimes(1);
          expect(workSpace.onPointerMove)
            .toBeCalledTimes(1);

          dispose!();

          emit(EVENT.pointerDown);
          emit(EVENT.pointerMove);

          expect(workSpace.onPointerDown)
            .toBeCalledTimes(1);
          expect(workSpace.onPointerMove)
            .toBeCalledTimes(1);

          expect(subscribeToDXPointerMoveEvent)
            .toHaveBeenCalledTimes(1);
          expect(subscribeToDXPointerDownEvent)
            .toHaveBeenCalledTimes(1);
        });
      });

      describe('pointerUpEffect', () => {
        beforeEach(clear);

        it('should work correctly', () => {
          const ref: any = createRef();
          mount(
            <div>
              <div className={DATE_TABLE_ROW_CLASS}>
                <div ref={ref} className={DATE_TABLE_CELL_CLASS} />
              </div>
            </div>,
          );
          const eventMock: any = {
            type: 'mouse',
            target: ref.current,
            button: 0,
          };

          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            currentDate: new Date(2021, 10, 20),
            startViewDate: new Date(2021, 10, 20),
          });

          mockGetCellData.mockImplementationOnce(() => ({
            startDate: new Date(2021, 10, 20),
            index: 0,
            groupIndex: 0,
          }));
          workSpace.onPointerUp = jest.fn();
          workSpace.onPointerDown(eventMock);

          const disposePointerUp = workSpace.pointerUpEffect();

          emit(EVENT.pointerUp);

          expect(workSpace.onPointerUp)
            .toBeCalledTimes(1);

          disposePointerUp!();

          emit(EVENT.pointerUp);
          expect(workSpace.onPointerUp)
            .toBeCalledTimes(1);
        });
      });
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('isAllDayPanelVisible', () => {
        it('should return false when all-day panel is not supported', () => {
          const workSpace = new WorkSpace({
            currentDate: new Date(),
            isAllDayPanelSupported: false,
            showAllDayPanel: false,
            type: 'timelineWeek',
          } as any);

          expect(workSpace.isAllDayPanelVisible)
            .toBe(false);

          workSpace.props.showAllDayPanel = true;

          expect(workSpace.isAllDayPanelVisible)
            .toBe(false);
        });

        it('should return false when all-day panel is supported but showAllDayPanel is false', () => {
          const workSpace = new WorkSpace({
            currentDate: new Date(),
            isAllDayPanelSupported: true,
            showAllDayPanel: false,
            type: 'week',
          } as any);

          expect(workSpace.isAllDayPanelVisible)
            .toBe(false);
        });

        it('should return true when all-day panel is supported and showAllDayPanel is true', () => {
          const workSpace = new WorkSpace({
            currentDate: new Date(),
            isAllDayPanelSupported: true,
            showAllDayPanel: true,
            type: 'week',
          } as any);

          expect(workSpace.isAllDayPanelVisible)
            .toBe(true);
        });
      });

      describe('isRenderHeaderEmptyCell', () => {
        it('should return true when vertical grouping is used', () => {
          const workSpace = new WorkSpace({
            groups,
            groupOrientation: 'vertical',
            type: 'month',
          } as any);

          expect(workSpace.isRenderHeaderEmptyCell)
            .toBe(true);
        });

        it('should return false when horizontal grouping is used', () => {
          const workSpace = new WorkSpace({
            groups,
            groupOrientation: 'horizontal',
            type: 'month',
          } as any);

          expect(workSpace.isRenderHeaderEmptyCell)
            .toBe(false);
        });

        it('should return false without groups', () => {
          const workSpace = new WorkSpace({
            groups: [],
            groupOrientation: 'vertical',
            type: 'month',
          } as any);

          expect(workSpace.isRenderHeaderEmptyCell)
            .toBe(false);
        });

        ['day', 'week', 'workWeek'].forEach((view) => {
          it(`should return true for "${view}" view`, () => {
            const workSpace = new WorkSpace({
              groups,
              groupOrientation: 'horizontal',
              type: view,
            } as any);

            expect(workSpace.isRenderHeaderEmptyCell)
              .toBe(true);
          });
        });
      });

      describe('completeViewDataMap', () => {
        it('should create completeViewDataMap', () => {
          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            currentDate: new Date(2021, 9, 26),
            startViewDate: new Date(2021, 9, 26),
            startDayHour: 0,
            endDayHour: 1,
            onViewRendered: () => {},
            type: 'day',
            showAllDayPanel: true,
          });

          expect(workSpace.completeViewDataMap)
            .toEqual([[{
              startDate: new Date(2021, 9, 26),
              endDate: new Date(2021, 9, 26),
              groupIndex: 0,
              index: 0,
              allDay: true,
              isFirstGroupCell: true,
              isLastGroupCell: true,
              key: 0,
            }], [{
              startDate: new Date(2021, 9, 26),
              endDate: new Date(2021, 9, 26, 0, 30),
              groupIndex: 0,
              index: 0,
              allDay: false,
              isFirstGroupCell: true,
              isLastGroupCell: true,
              key: 0,
            }], [{
              startDate: new Date(2021, 9, 26, 0, 30),
              endDate: new Date(2021, 9, 26, 1),
              groupIndex: 0,
              index: 1,
              allDay: false,
              isFirstGroupCell: true,
              isLastGroupCell: true,
              key: 1,
            }]]);
        });
      });

      describe('viewDataMap', () => {
        it('should create viewDataMap', () => {
          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            currentDate: new Date(2021, 9, 26),
            startViewDate: new Date(2021, 9, 26),
            startDayHour: 0,
            endDayHour: 1,
            onViewRendered: () => {},
            type: 'day',
            showAllDayPanel: true,
          });

          expect(workSpace.viewDataMap)
            .toEqual({
              allDayPanelMap: [{
                position: {
                  columnIndex: 0,
                  rowIndex: 0,
                },
                cellData: {
                  startDate: new Date(2021, 9, 26),
                  endDate: new Date(2021, 9, 26),
                  groupIndex: 0,
                  index: 0,
                  allDay: true,
                  isFirstGroupCell: true,
                  isLastGroupCell: true,
                  key: 0,
                },
              }],
              dateTableMap: [[{
                position: {
                  columnIndex: 0,
                  rowIndex: 0,
                },
                cellData: {
                  startDate: new Date(2021, 9, 26),
                  endDate: new Date(2021, 9, 26, 0, 30),
                  groupIndex: 0,
                  index: 0,
                  allDay: false,
                  isFirstGroupCell: true,
                  isLastGroupCell: true,
                  key: 0,
                },
              }], [{
                position: {
                  columnIndex: 0,
                  rowIndex: 1,
                },
                cellData: {
                  startDate: new Date(2021, 9, 26, 0, 30),
                  endDate: new Date(2021, 9, 26, 1),
                  groupIndex: 0,
                  index: 1,
                  allDay: false,
                  isFirstGroupCell: true,
                  isLastGroupCell: true,
                  key: 1,
                },
              }]],
            });
        });
      });

      describe('viewDataMapWithSelection', () => {
        it('should return viewDataMap if cell selection state is undefined', () => {
          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            currentDate: new Date(2021, 9, 26),
            startViewDate: new Date(2021, 9, 26),
            startDayHour: 0,
            endDayHour: 1,
            onViewRendered: () => {},
            type: 'day',
            showAllDayPanel: true,
          });

          expect(workSpace.viewDataMapWithSelection)
            .toEqual({
              allDayPanelMap: [{
                position: {
                  columnIndex: 0,
                  rowIndex: 0,
                },
                cellData: {
                  startDate: new Date(2021, 9, 26),
                  endDate: new Date(2021, 9, 26),
                  groupIndex: 0,
                  index: 0,
                  allDay: true,
                  isFirstGroupCell: true,
                  isLastGroupCell: true,
                  key: 0,
                },
              }],
              dateTableMap: [[{
                position: {
                  columnIndex: 0,
                  rowIndex: 0,
                },
                cellData: {
                  startDate: new Date(2021, 9, 26),
                  endDate: new Date(2021, 9, 26, 0, 30),
                  groupIndex: 0,
                  index: 0,
                  allDay: false,
                  isFirstGroupCell: true,
                  isLastGroupCell: true,
                  key: 0,
                },
              }], [{
                position: {
                  columnIndex: 0,
                  rowIndex: 1,
                },
                cellData: {
                  startDate: new Date(2021, 9, 26, 0, 30),
                  endDate: new Date(2021, 9, 26, 1),
                  groupIndex: 0,
                  index: 1,
                  allDay: false,
                  isFirstGroupCell: true,
                  isLastGroupCell: true,
                  key: 1,
                },
              }]],
            });
        });

        it('should work correctly when cells selection state is defined', () => {
          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            currentDate: new Date(2021, 9, 26),
            startViewDate: new Date(2021, 9, 26),
            startDayHour: 0,
            endDayHour: 2,
            onViewRendered: () => {},
            type: 'day',
            showAllDayPanel: true,
          });

          workSpace.cellsSelectionState = {
            focusedCell: {
              position: {
                columnIndex: 0,
                rowIndex: 1,
              },
              cellData: {
                startDate: new Date(2021, 9, 26, 0, 30),
                endDate: new Date(2021, 9, 26, 1),
                groupIndex: 0,
                index: 1,
                allDay: false,
                isFirstGroupCell: true,
                isLastGroupCell: true,
                key: 1,
              },
            },
            selectedCells: [{
              startDate: new Date(2021, 9, 26),
              endDate: new Date(2021, 9, 26, 0, 30),
              groupIndex: 0,
              index: 0,
              allDay: false,
              isFirstGroupCell: true,
              isLastGroupCell: true,
              key: 0,
            }, {
              startDate: new Date(2021, 9, 26, 0, 30),
              endDate: new Date(2021, 9, 26, 1),
              groupIndex: 0,
              index: 1,
              allDay: false,
              isFirstGroupCell: true,
              isLastGroupCell: true,
              key: 1,
            }],
            firstSelectedCell: {
              startDate: new Date(2021, 9, 26),
              endDate: new Date(2021, 9, 26, 0, 30),
              groupIndex: 0,
              index: 0,
              allDay: false,
              isFirstGroupCell: true,
              isLastGroupCell: true,
              key: 0,
            },
          };

          expect(workSpace.viewDataMapWithSelection)
            .toEqual({
              allDayPanelMap: [{
                position: {
                  columnIndex: 0,
                  rowIndex: 0,
                },
                cellData: {
                  startDate: new Date(2021, 9, 26),
                  endDate: new Date(2021, 9, 26),
                  groupIndex: 0,
                  index: 0,
                  allDay: true,
                  isFirstGroupCell: true,
                  isLastGroupCell: true,
                  key: 0,
                },
              }],
              dateTableMap: [[{
                position: {
                  columnIndex: 0,
                  rowIndex: 0,
                },
                cellData: {
                  startDate: new Date(2021, 9, 26),
                  endDate: new Date(2021, 9, 26, 0, 30),
                  groupIndex: 0,
                  index: 0,
                  allDay: false,
                  isFirstGroupCell: true,
                  isLastGroupCell: true,
                  key: 0,
                  isFocused: false,
                  isSelected: true,
                },
              }], [{
                position: {
                  columnIndex: 0,
                  rowIndex: 1,
                },
                cellData: {
                  startDate: new Date(2021, 9, 26, 0, 30),
                  endDate: new Date(2021, 9, 26, 1),
                  groupIndex: 0,
                  index: 1,
                  allDay: false,
                  isFirstGroupCell: true,
                  isLastGroupCell: true,
                  key: 1,
                  isFocused: true,
                  isSelected: true,
                },
              }], [{
                position: {
                  columnIndex: 0,
                  rowIndex: 2,
                },
                cellData: {
                  startDate: new Date(2021, 9, 26, 1, 0),
                  endDate: new Date(2021, 9, 26, 1, 30),
                  groupIndex: 0,
                  index: 2,
                  allDay: false,
                  isFirstGroupCell: true,
                  isLastGroupCell: true,
                  key: 2,
                },
              }], [{
                position: {
                  columnIndex: 0,
                  rowIndex: 3,
                },
                cellData: {
                  startDate: new Date(2021, 9, 26, 1, 30),
                  endDate: new Date(2021, 9, 26, 2),
                  groupIndex: 0,
                  index: 3,
                  allDay: false,
                  isFirstGroupCell: true,
                  isLastGroupCell: true,
                  key: 3,
                },
              }]],
            });
        });
      });

      describe('viewData', () => {
        it('should create viewData', () => {
          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            currentDate: new Date(2021, 9, 26),
            startViewDate: new Date(2021, 9, 26),
            startDayHour: 0,
            endDayHour: 1,
            onViewRendered: () => {},
            type: 'day',
            showAllDayPanel: true,
          });

          expect(workSpace.viewData)
            .toEqual({
              groupedData: [{
                allDayPanel: [{
                  startDate: new Date(2021, 9, 26),
                  endDate: new Date(2021, 9, 26),
                  groupIndex: 0,
                  index: 0,
                  allDay: true,
                  isFirstGroupCell: true,
                  isLastGroupCell: true,
                  key: 0,
                }],
                dateTable: [{
                  cells: [{
                    startDate: new Date(2021, 9, 26),
                    endDate: new Date(2021, 9, 26, 0, 30),
                    groupIndex: 0,
                    index: 0,
                    allDay: false,
                    isFirstGroupCell: true,
                    isLastGroupCell: true,
                    key: 0,
                  }],
                  key: 0,
                }, {
                  cells: [{
                    startDate: new Date(2021, 9, 26, 0, 30),
                    endDate: new Date(2021, 9, 26, 1),
                    groupIndex: 0,
                    index: 1,
                    allDay: false,
                    isFirstGroupCell: true,
                    isLastGroupCell: true,
                    key: 1,
                  }],
                  key: 1,
                }],
                groupIndex: 0,
                isGroupedAllDayPanel: false,
                key: '0',
              }],
              topVirtualRowCount: 0,
              bottomVirtualRowCount: 0,
              leftVirtualCellCount: 0,
              rightVirtualCellCount: 0,
              isGroupedAllDayPanel: false,
            });
        });
      });

      describe('completeDateHeaderData', () => {
        it('should generate complete dateHeaderData', () => {
          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            currentDate: new Date(2021, 9, 25),
            startViewDate: new Date(2021, 9, 25),
            startDayHour: 0,
            endDayHour: 1,
            onViewRendered: () => {},
            type: 'day',
          });

          expect(workSpace.completeDateHeaderData)
            .toEqual([[{
              startDate: new Date(2021, 9, 25),
              allDay: false,
              groupIndex: 0,
              text: 'Mon 25',
              today: false,
              index: 0,
              key: 0,
              colSpan: 1,
              isFirstGroupCell: true,
              isLastGroupCell: true,
            }]]);
        });

        it('should generate complete dateHeaderData in case of timeline views', () => {
          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            currentDate: new Date(2021, 9, 24),
            startViewDate: new Date(2021, 9, 24),
            startDayHour: 0,
            endDayHour: 1,
            onViewRendered: () => {},
            type: 'timelineDay',
            intervalCount: 2,
          });

          expect(workSpace.completeDateHeaderData)
            .toEqual([[{
              startDate: new Date(2021, 9, 24),
              endDate: new Date(2021, 9, 24, 0, 30),
              allDay: false,
              groupIndex: 0,
              index: 0,
              key: 0,
              colSpan: 2,
              text: 'Sun 24',
              isFirstGroupCell: false,
              isLastGroupCell: false,
            }, {
              startDate: new Date(2021, 9, 25),
              endDate: new Date(2021, 9, 25, 0, 30),
              allDay: false,
              groupIndex: 0,
              index: 2,
              key: 2,
              colSpan: 2,
              text: 'Mon 25',
              isFirstGroupCell: false,
              isLastGroupCell: false,
            }], [{
              startDate: new Date(2021, 9, 24),
              allDay: false,
              groupIndex: 0,
              text: '12:00 AM',
              index: 0,
              key: 0,
              colSpan: 1,
              isFirstGroupCell: false,
              isLastGroupCell: false,
              today: false,
            }, {
              startDate: new Date(2021, 9, 24, 0, 30),
              allDay: false,
              groupIndex: 0,
              text: '12:30 AM',
              index: 1,
              key: 1,
              colSpan: 1,
              isFirstGroupCell: false,
              isLastGroupCell: false,
              today: false,
            }, {
              startDate: new Date(2021, 9, 25),
              allDay: false,
              groupIndex: 0,
              text: '12:00 AM',
              index: 2,
              key: 2,
              colSpan: 1,
              isFirstGroupCell: false,
              isLastGroupCell: false,
              today: false,
            }, {
              startDate: new Date(2021, 9, 25, 0, 30),
              allDay: false,
              groupIndex: 0,
              text: '12:30 AM',
              index: 3,
              key: 3,
              colSpan: 1,
              isFirstGroupCell: false,
              isLastGroupCell: false,
              today: false,
            }]]);
        });
      });

      describe('dateHeaderData', () => {
        it('should generate dateHeaderData', () => {
          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            currentDate: new Date(2021, 9, 25),
            startViewDate: new Date(2021, 9, 25),
            startDayHour: 0,
            endDayHour: 1,
            onViewRendered: () => {},
            type: 'day',
          });

          expect(workSpace.dateHeaderData)
            .toEqual({
              dataMap: [[{
                startDate: new Date(2021, 9, 25),
                allDay: false,
                groupIndex: 0,
                text: 'Mon 25',
                today: false,
                index: 0,
                key: 0,
                colSpan: 1,
                isFirstGroupCell: true,
                isLastGroupCell: true,
              }]],
              leftVirtualCellCount: 0,
              rightVirtualCellCount: 0,
              leftVirtualCellWidth: undefined,
              rightVirtualCellWidth: undefined,
              weekDayLeftVirtualCellCount: undefined,
              weekDayLeftVirtualCellWidth: undefined,
              weekDayRightVirtualCellCount: undefined,
              weekDayRightVirtualCellWidth: undefined,
              isMonthDateHeader: false,
            });
        });

        it('should generate dateHeaderData for timeline views', () => {
          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            currentDate: new Date(2021, 9, 24),
            startViewDate: new Date(2021, 9, 24),
            startDayHour: 0,
            endDayHour: 1,
            onViewRendered: () => {},
            type: 'timelineDay',
            intervalCount: 2,
          });

          expect(workSpace.dateHeaderData)
            .toEqual({
              dataMap: [[{
                startDate: new Date(2021, 9, 24),
                endDate: new Date(2021, 9, 24, 0, 30),
                allDay: false,
                groupIndex: 0,
                index: 0,
                key: 0,
                colSpan: 2,
                text: 'Sun 24',
                isFirstGroupCell: false,
                isLastGroupCell: false,
              }, {
                startDate: new Date(2021, 9, 25),
                endDate: new Date(2021, 9, 25, 0, 30),
                allDay: false,
                groupIndex: 0,
                index: 2,
                key: 2,
                colSpan: 2,
                text: 'Mon 25',
                isFirstGroupCell: false,
                isLastGroupCell: false,
              }], [{
                startDate: new Date(2021, 9, 24),
                allDay: false,
                groupIndex: 0,
                text: '12:00 AM',
                index: 0,
                key: 0,
                colSpan: 1,
                isFirstGroupCell: false,
                isLastGroupCell: false,
                today: false,
              }, {
                startDate: new Date(2021, 9, 24, 0, 30),
                allDay: false,
                groupIndex: 0,
                text: '12:30 AM',
                index: 1,
                key: 1,
                colSpan: 1,
                isFirstGroupCell: false,
                isLastGroupCell: false,
                today: false,
              }, {
                startDate: new Date(2021, 9, 25),
                allDay: false,
                groupIndex: 0,
                text: '12:00 AM',
                index: 2,
                key: 2,
                colSpan: 1,
                isFirstGroupCell: false,
                isLastGroupCell: false,
                today: false,
              }, {
                startDate: new Date(2021, 9, 25, 0, 30),
                allDay: false,
                groupIndex: 0,
                text: '12:30 AM',
                index: 3,
                key: 3,
                colSpan: 1,
                isFirstGroupCell: false,
                isLastGroupCell: false,
                today: false,
              }]],
              leftVirtualCellCount: 0,
              rightVirtualCellCount: 0,
              leftVirtualCellWidth: 0,
              rightVirtualCellWidth: 0,
              weekDayLeftVirtualCellCount: 0,
              weekDayLeftVirtualCellWidth: 0,
              weekDayRightVirtualCellCount: 0,
              weekDayRightVirtualCellWidth: 0,
              isMonthDateHeader: false,
            });
        });
      });

      describe('completeTimePanelData', () => {
        it('should return correct completeTimePanelData', () => {
          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            currentDate: new Date(2021, 9, 25),
            startViewDate: new Date(2021, 9, 25),
            startDayHour: 0,
            endDayHour: 1,
            onViewRendered: () => {},
            type: 'day',
          } as any);

          expect(workSpace.completeTimePanelData)
            .toEqual([{
              startDate: new Date(2021, 9, 25),
              groupIndex: undefined,
              index: 0,
              allDay: false,
              isFirstGroupCell: false,
              isLastGroupCell: false,
              key: 0,
              text: '12:00 AM',
              groups: undefined,
            }, {
              startDate: new Date(2021, 9, 25, 0, 30),
              groupIndex: undefined,
              index: 1,
              allDay: false,
              isFirstGroupCell: false,
              isLastGroupCell: false,
              key: 1,
              text: '',
              groups: undefined,
            }]);
        });

        it('should not generate completeTimePanelData when it is not necessary', () => {
          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            currentDate: new Date(2021, 9, 25),
            startDayHour: 0,
            endDayHour: 1,
            onViewRendered: () => {},
            type: 'month',
          } as any);

          expect(workSpace.completeTimePanelData)
            .toBe(undefined);
        });
      });

      describe('timePanelData', () => {
        it('should return correct timePanelData', () => {
          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            currentDate: new Date(2021, 9, 25),
            startViewDate: new Date(2021, 9, 25),
            startDayHour: 0,
            endDayHour: 1,
            onViewRendered: () => {},
            type: 'day',
          } as any);

          expect(workSpace.timePanelData)
            .toEqual({
              groupedData: [{
                dateTable: [{
                  startDate: new Date(2021, 9, 25),
                  groupIndex: undefined,
                  index: 0,
                  allDay: false,
                  isFirstGroupCell: false,
                  isLastGroupCell: false,
                  key: 0,
                  text: '12:00 AM',
                  groups: undefined,
                }, {
                  startDate: new Date(2021, 9, 25, 0, 30),
                  groupIndex: undefined,
                  index: 1,
                  allDay: false,
                  isFirstGroupCell: false,
                  isLastGroupCell: false,
                  key: 1,
                  text: '',
                  groups: undefined,
                }],
                groupIndex: undefined,
                isGroupedAllDayPanel: false,
                key: '0',
              }],
              isGroupedAllDayPanel: false,
            });
        });

        it('should not generate timePanelData when it is not necessary', () => {
          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            currentDate: new Date(2021, 9, 25),
            startDayHour: 0,
            endDayHour: 1,
            onViewRendered: () => {},
            type: 'month',
          } as any);

          expect(workSpace.timePanelData)
            .toBe(undefined);
        });
      });

      describe('viewDataProvider', () => {
        beforeEach(() => {
          jest.clearAllMocks();
        });

        it('should create view data provider and call its update method', () => {
          const props: any = {
            groupOrientation: 'horizontal',
            groupByDate: true,
            groups: [],
            selectedCells: undefined,
            focusedCell: undefined,
            startDayHour: 0,
            endDayHour: 24,
            cellDuration: 30,
            intervalCount: 1,
            hoursInterval: 0.5,
            currentDate: new Date(2021, 8, 11),
            startDate: null,
            firstDayOfWeek: 0,
          };

          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            startViewDate: new Date(2021, 8, 11),
            ...props,
            type: 'week',
          });

          expect(workSpace.viewDataProvider)
            .toBe(mockViewDataProvider);

          expect(mockSetViewOptions)
            .toHaveBeenCalledWith({
              ...props,
              startRowIndex: 0,
              startCellIndex: 0,
              isAllDayPanelVisible: false,
              viewType: 'week',
              getDateForHeaderText: expect.any(Function),
              headerCellTextFormat: expect.any(Function),
              isGenerateTimePanelData: true,
              isGenerateWeekDaysHeaderData: false,
              isProvideVirtualCellsWidth: false,
              groupByDate: false,
            });
          expect(mockCreateGroupedDataMapProvider)
            .toBeCalledTimes(1);
        });
      });

      describe('groupPanelData', () => {
        beforeEach(() => {
          jest.clearAllMocks();
        });

        it('should return correct group panel data', () => {
          const props: any = {
            groupOrientation: 'horizontal',
            groupByDate: false,
            groups,
            selectedCells: undefined,
            focusedCell: undefined,
            startDayHour: 0,
            endDayHour: 24,
            cellDuration: 30,
            intervalCount: 1,
            hoursInterval: 0.5,
            currentDate: new Date(2021, 8, 11),
            startDate: null,
            firstDayOfWeek: 0,
          };

          const workSpace = new WorkSpace({
            ...props,
            type: 'week',
          });

          expect(workSpace.groupPanelData)
            .toEqual({
              baseColSpan: 7,
              groupPanelItems: [[{
                color: 'red',
                id: 0,
                resourceName: 'resourceId',
                text: 'Resource 1',
                key: '0_resourceId_0',
                data: {
                  color: 'red',
                  id: 0,
                  text: 'Resource 1',
                },
              }, {
                color: 'green',
                id: 1,
                resourceName: 'resourceId',
                text: 'Resource 2',
                key: '0_resourceId_1',
                data: {
                  color: 'green',
                  id: 1,
                  text: 'Resource 2',
                },
              }]],
            });
        });

        it('should return correct group panel data when grouping by date is enabled', () => {
          const props: any = {
            ...new WorkSpaceProps(),
            groupOrientation: 'horizontal',
            groupByDate: true,
            groups,
            intervalCount: 2,
            currentDate: new Date(2021, 8, 11),
            type: 'day',
          };

          const workSpace = new WorkSpace(props);

          expect(workSpace.groupPanelData)
            .toEqual({
              baseColSpan: 1,
              groupPanelItems: [[{
                color: 'red',
                id: 0,
                resourceName: 'resourceId',
                text: 'Resource 1',
                key: '0_resourceId_0_group_by_date_0',
                isFirstGroupCell: true,
                isLastGroupCell: false,
                data: {
                  color: 'red',
                  id: 0,
                  text: 'Resource 1',
                },
              }, {
                color: 'green',
                id: 1,
                resourceName: 'resourceId',
                text: 'Resource 2',
                key: '0_resourceId_1_group_by_date_0',
                isFirstGroupCell: false,
                isLastGroupCell: true,
                data: {
                  color: 'green',
                  id: 1,
                  text: 'Resource 2',
                },
              }, {
                color: 'red',
                id: 0,
                resourceName: 'resourceId',
                text: 'Resource 1',
                key: '0_resourceId_0_group_by_date_1',
                isFirstGroupCell: true,
                isLastGroupCell: false,
                data: {
                  color: 'red',
                  id: 0,
                  text: 'Resource 1',
                },
              }, {
                color: 'green',
                id: 1,
                resourceName: 'resourceId',
                text: 'Resource 2',
                key: '0_resourceId_1_group_by_date_1',
                isFirstGroupCell: false,
                isLastGroupCell: true,
                data: {
                  color: 'green',
                  id: 1,
                  text: 'Resource 2',
                },
              }]],
            });
        });
      });

      describe('renderConfig', () => {
        beforeEach(() => {
          jest.clearAllMocks();
        });

        it('should call "getViewRenderConfigByType" and pass correct props to it', () => {
          const workSpace = new WorkSpace({
            type: 'week',
            crossScrollingEnabled: true,
            groups,
            groupOrientation: 'vertical',
            intervalCount: 3,
          } as any);

          expect(workSpace.renderConfig)
            .toEqual({
              headerPanelTemplate: HeaderPanelLayout,
              dateTableTemplate: DateTableLayoutBase,
              isUseMonthDateTable: false,
              isUseTimelineHeader: false,
              isAllDayPanelSupported: true,
              isProvideVirtualCellsWidth: false,
              isRenderTimePanel: true,
              isMonthDateHeader: false,
              groupPanelClassName: 'dx-scheduler-work-space-vertical-group-table',
              headerCellTextFormat: formatWeekdayAndDay,
              getDateForHeaderText: expect.any(Function),
              isRenderDateHeader: true,
              isGenerateWeekDaysHeaderData: false,
              className: 'dx-scheduler-work-space-week',
              scrollingDirection: 'vertical',
              isCreateCrossScrolling: true,
              defaultGroupOrientation: 'horizontal',
            });

          expect(getViewRenderConfigByType)
            .toBeCalledWith('week', true, 3, groups, 'vertical');
        });
      });

      describe('isVerticalGrouping', () => {
        it('should call isVerticalGroupingApplied', () => {
          const workSpace = new WorkSpace({
            groups,
            groupOrientation: 'vertical',
            type: 'day',
          } as any);

          const result = workSpace.isVerticalGrouping;

          expect(result)
            .toBe(true);
          expect(isVerticalGroupingApplied)
            .toBeCalledWith(groups, 'vertical');
        });
      });

      describe('isHorizontalGrouping', () => {
        it('should call isHorizontalGroupingApplied', () => {
          const workSpace = new WorkSpace({
            groups,
            groupOrientation: 'horizontal',
            type: 'day',
          } as any);

          const result = workSpace.isHorizontalGrouping;

          expect(result)
            .toBe(true);
          expect(isHorizontalGroupingApplied)
            .toBeCalledWith(groups, 'horizontal');
        });
      });

      describe('isGroupedByDate', () => {
        it('should return false in basic case', () => {
          const workSpace = new WorkSpace({
            groups: [],
            groupOrientation: 'horizontal',
            type: 'day',
            groupByDate: false,
          } as any);

          expect(workSpace.isGroupedByDate)
            .toBe(false);
        });

        it('should return false when vertical grouping is used', () => {
          const workSpace = new WorkSpace({
            groups,
            groupOrientation: 'vertical',
            type: 'day',
            groupByDate: true,
          } as any);

          expect(workSpace.isGroupedByDate)
            .toBe(false);
        });

        it('should return true when grouping by date is used', () => {
          const workSpace = new WorkSpace({
            groups,
            groupOrientation: 'horizontal',
            type: 'day',
            groupByDate: true,
          } as any);

          expect(workSpace.isGroupedByDate)
            .toBe(true);
        });

        it('should return false when grouping is not used', () => {
          const workSpace = new WorkSpace({
            groups: [],
            groupOrientation: 'horizontal',
            type: 'day',
            groupByDate: true,
          } as any);

          expect(workSpace.isGroupedByDate)
            .toBe(false);
        });
      });

      describe('isStandaloneAllDayPanel', () => {
        it('should return true when vertical group orientation is not used and all day panel is visible', () => {
          const workSpace = new WorkSpace({
            groups,
            groupOrientation: 'horizontal',
            showAllDayPanel: true,
            type: 'week',
          } as any);

          const result = workSpace.isStandaloneAllDayPanel;

          expect(result)
            .toBe(true);
          expect(isVerticalGroupingApplied)
            .toBeCalledWith(groups, 'horizontal');
        });

        it('should return false if all day panel is not visible', () => {
          const workSpace = new WorkSpace({
            groups,
            groupOrientation: 'horizontal',
            showAllDayPanel: false,
            type: 'week',
          } as any);

          const result = workSpace.isStandaloneAllDayPanel;

          expect(result)
            .toBe(false);
          expect(isVerticalGroupingApplied)
            .toBeCalledWith(groups, 'horizontal');
        });
      });

      describe('groupOrientation', () => {
        [{
          view: 'day',
          expectedGroupOrientation: 'horizontal',
        }, {
          view: 'week',
          expectedGroupOrientation: 'horizontal',
        }, {
          view: 'month',
          expectedGroupOrientation: 'horizontal',
        }, {
          view: 'timelineDay',
          expectedGroupOrientation: 'vertical',
        }, {
          view: 'timelineWeek',
          expectedGroupOrientation: 'vertical',
        }, {
          view: 'timelineMonth',
          expectedGroupOrientation: 'vertical',
        }].forEach(({ view, expectedGroupOrientation }) => {
          it(`should return correct groupOrientation for ${view} view`, () => {
            const workSpace = new WorkSpace({
              ...new WorkSpaceProps(),
              type: view,
            } as any);

            expect(workSpace.groupOrientation)
              .toBe(expectedGroupOrientation);
          });
        });
      });

      describe('correctedVirtualScrollingState', () => {
        it('should return value from state', () => {
          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            type: 'day',
            currentDate: new Date(2021, 10, 9),
            scrolling: { mode: 'virtual' },
            schedulerHeight: 300,
            schedulerWidth: 300,
          } as any);

          const state = {
            startCellIndex: 6,
            startRowIndex: 7,
          };

          workSpace.virtualScrollingData = {
            state,
          } as any;

          expect(workSpace.correctedVirtualScrollingState)
            .toEqual(state);
        });

        it('should update value from state', () => {
          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            type: 'day',
            currentDate: new Date(2021, 10, 9),
            scrolling: { mode: 'virtual' },
            schedulerHeight: 300,
            schedulerWidth: 300,
          } as any);

          const state = {
            startRowIndex: 7,
          };

          workSpace.virtualScrollingData = {
            state,
          } as any;

          expect(workSpace.correctedVirtualScrollingState)
            .toEqual({
              startRowIndex: 7,
              startCellIndex: 0,
            });
        });

        it('should calculate default value if state is undefined', () => {
          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            type: 'day',
            currentDate: new Date(2021, 10, 9),
            startViewDate: new Date(2021, 10, 9),
            scrolling: { mode: 'virtual' },
            schedulerHeight: 300,
            schedulerWidth: 300,
          } as any);

          expect(workSpace.correctedVirtualScrollingState)
            .toEqual({
              bottomVirtualRowHeight: 1950,
              cellCount: 1,
              cellWidth: 75,
              leftVirtualCellWidth: 0,
              rightVirtualCellWidth: 0,
              rowCount: 9,
              startCellIndex: 0,
              startIndex: 0,
              startRowIndex: 0,
              topVirtualRowHeight: 0,
            });
        });

        it('should calculate default value if state is undefined and rtl is enabled', () => {
          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            type: 'day',
            currentDate: new Date(2021, 10, 9),
            startViewDate: new Date(2021, 10, 9),
            scrolling: { mode: 'virtual' },
            schedulerHeight: 300,
            schedulerWidth: 300,
          } as any);

          workSpace.config = { rtlEnabled: true };

          expect(workSpace.correctedVirtualScrollingState)
            .toEqual({
              bottomVirtualRowHeight: 1950,
              cellCount: 1,
              cellWidth: 75,
              leftVirtualCellWidth: 0,
              rightVirtualCellWidth: 0,
              rowCount: 9,
              startCellIndex: 0,
              startIndex: 0,
              startRowIndex: 0,
              topVirtualRowHeight: 0,
            });
        });
      });
    });

    describe('dataGenerators', () => {
      it('should create data generators', () => {
        const workSpace = new WorkSpace({
          ...new WorkSpaceProps(),
        } as any);

        expect(workSpace.viewDataGenerator instanceof ViewDataGenerator)
          .toBe(true);
        expect(workSpace.dateHeaderDataGenerator instanceof DateHeaderDataGenerator)
          .toBe(true);
        expect(workSpace.timePanelDataGenerator instanceof TimePanelDataGenerator)
          .toBe(true);
      });
    });

    describe('classes', () => {
      afterEach(jest.clearAllMocks);

      it('should call combineClasses with correct parameters', () => {
        const workSpace = new WorkSpace({
          ...new WorkSpaceProps(),
          intervalCount: 35,
          type: 'day',
          hoursInterval: 0.5,
          showAllDayPanel: true,
          groupByDate: true,
          groups,
          groupOrientation: 'vertical',
        } as any);

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        workSpace.classes;

        expect(combineClasses)
          .toBeCalledWith({
            'dx-scheduler-work-space-day': true,
            'dx-scheduler-work-space-count': true,
            'dx-scheduler-work-space-odd-cells': false,
            'dx-scheduler-work-space-all-day-collapsed': true,
            'dx-scheduler-work-space-all-day': true,
            'dx-scheduler-work-space-group-by-date': false,
            'dx-scheduler-work-space-grouped': true,
            'dx-scheduler-work-space-vertical-grouped': true,
            'dx-scheduler-work-space-horizontal-grouped': false,
            'dx-scheduler-group-column-count-one': true,
            'dx-scheduler-group-column-count-two': false,
            'dx-scheduler-group-column-count-three': false,
            'dx-scheduler-work-space': true,
            'dx-scheduler-work-space-virtual': false,
            'dx-scheduler-work-space-both-scrollbar': false,
          });
      });

      it('should call combineClasses with correct parameters when all-day panel is not collapsed', () => {
        const workSpace = new WorkSpace({
          ...new WorkSpaceProps(),
          intervalCount: 35,
          type: 'day',
          groupByDate: true,
          groups,
          groupOrientation: 'vertical',
          allDayPanelExpanded: true,
          showAllDayPanel: true,
        } as any);

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        workSpace.classes;

        expect(combineClasses)
          .toBeCalledWith({
            'dx-scheduler-work-space-day': true,
            'dx-scheduler-work-space-count': true,
            'dx-scheduler-work-space-odd-cells': false,
            'dx-scheduler-work-space-all-day-collapsed': false,
            'dx-scheduler-work-space-all-day': true,
            'dx-scheduler-work-space-group-by-date': false,
            'dx-scheduler-work-space-grouped': true,
            'dx-scheduler-work-space-vertical-grouped': true,
            'dx-scheduler-work-space-horizontal-grouped': false,
            'dx-scheduler-group-column-count-one': true,
            'dx-scheduler-group-column-count-two': false,
            'dx-scheduler-group-column-count-three': false,
            'dx-scheduler-work-space': true,
            'dx-scheduler-work-space-virtual': false,
            'dx-scheduler-work-space-both-scrollbar': false,
          });
      });

      it('should call combineClasses with correct parameters when all-day panel is not visible', () => {
        const workSpace = new WorkSpace({
          ...new WorkSpaceProps(),
          type: 'day',
          intervalCount: 35,
          showAllDayPanel: false,
          groupByDate: true,
          groups,
          groupOrientation: 'vertical',
        } as any);

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        workSpace.classes;

        expect(combineClasses)
          .toBeCalledWith({
            'dx-scheduler-work-space-day': true,
            'dx-scheduler-work-space-count': true,
            'dx-scheduler-work-space-odd-cells': false,
            'dx-scheduler-work-space-all-day-collapsed': false,
            'dx-scheduler-work-space-all-day': false,
            'dx-scheduler-work-space-group-by-date': false,
            'dx-scheduler-work-space-grouped': true,
            'dx-scheduler-work-space-vertical-grouped': true,
            'dx-scheduler-work-space-horizontal-grouped': false,
            'dx-scheduler-group-column-count-one': true,
            'dx-scheduler-group-column-count-two': false,
            'dx-scheduler-group-column-count-three': false,
            'dx-scheduler-work-space': true,
            'dx-scheduler-work-space-virtual': false,
            'dx-scheduler-work-space-both-scrollbar': false,
          });
      });

      it('should call combineClasses with correct parameters when groups are empty', () => {
        const workSpace = new WorkSpace({
          ...new WorkSpaceProps(),
          type: 'day',
          intervalCount: 35,
          showAllDayPanel: true,
          groupByDate: false,
          groups: [],
          groupOrientation: 'horizontal',
        } as any);

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        workSpace.classes;

        expect(combineClasses)
          .toBeCalledWith({
            'dx-scheduler-work-space-day': true,
            'dx-scheduler-work-space-count': true,
            'dx-scheduler-work-space-odd-cells': false,
            'dx-scheduler-work-space-all-day-collapsed': true,
            'dx-scheduler-work-space-all-day': true,
            'dx-scheduler-work-space-group-by-date': false,
            'dx-scheduler-work-space-grouped': false,
            'dx-scheduler-work-space-vertical-grouped': false,
            'dx-scheduler-work-space-horizontal-grouped': false,
            'dx-scheduler-group-column-count-one': false,
            'dx-scheduler-group-column-count-two': false,
            'dx-scheduler-group-column-count-three': false,
            'dx-scheduler-work-space': true,
            'dx-scheduler-work-space-virtual': false,
            'dx-scheduler-work-space-both-scrollbar': false,
          });
      });

      it('should call combineClasses with correct parameters when groups are empty but groupOrientation is vertical', () => {
        const workSpace = new WorkSpace({
          ...new WorkSpaceProps(),
          type: 'day',
          intervalCount: 35,
          showAllDayPanel: true,
          groupByDate: false,
          groups: [],
          groupOrientation: 'vertical',
        } as any);

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        workSpace.classes;

        expect(combineClasses)
          .toBeCalledWith({
            'dx-scheduler-work-space-day': true,
            'dx-scheduler-work-space-count': true,
            'dx-scheduler-work-space-odd-cells': false,
            'dx-scheduler-work-space-all-day-collapsed': true,
            'dx-scheduler-work-space-all-day': true,
            'dx-scheduler-work-space-group-by-date': false,
            'dx-scheduler-work-space-grouped': false,
            'dx-scheduler-work-space-vertical-grouped': false,
            'dx-scheduler-work-space-horizontal-grouped': false,
            'dx-scheduler-group-column-count-one': false,
            'dx-scheduler-group-column-count-two': false,
            'dx-scheduler-group-column-count-three': false,
            'dx-scheduler-work-space': true,
            'dx-scheduler-work-space-virtual': false,
            'dx-scheduler-work-space-both-scrollbar': false,
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
      }].forEach(({ groups: currentGroups, groupOrientation, className }) => {
        it(`should call combineClasses with correct parameters when groups count is ${currentGroups.length} and groupOrientation is ${groupOrientation}`, () => {
          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            groups: currentGroups,
            groupOrientation,
            type: 'day',
            crossScrollingEnabled: false,
          } as any);

          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          workSpace.classes;

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
              'dx-scheduler-work-space-horizontal-grouped': false,
              'dx-scheduler-group-column-count-one': false,
              'dx-scheduler-group-column-count-two': false,
              'dx-scheduler-group-column-count-three': false,
              'dx-scheduler-work-space': true,
              'dx-scheduler-work-space-both-scrollbar': false,
              'dx-scheduler-work-space-virtual': false,
              [className]: true,
            });
        });
      });

      it('should work correctly when crossScrolling is used', () => {
        const workSpace = new WorkSpace({
          ...new WorkSpaceProps(),
          type: 'day',
          crossScrollingEnabled: true,
        } as any);

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        workSpace.classes;

        expect(combineClasses)
          .toBeCalledWith({
            'dx-scheduler-work-space-day': true,
            'dx-scheduler-work-space-count': false,
            'dx-scheduler-work-space-odd-cells': false,
            'dx-scheduler-work-space-all-day-collapsed': false,
            'dx-scheduler-work-space-all-day': false,
            'dx-scheduler-work-space-group-by-date': false,
            'dx-scheduler-work-space-grouped': false,
            'dx-scheduler-work-space-vertical-grouped': false,
            'dx-scheduler-work-space-horizontal-grouped': false,
            'dx-scheduler-group-column-count-one': false,
            'dx-scheduler-group-column-count-two': false,
            'dx-scheduler-group-column-count-three': false,
            'dx-scheduler-work-space': true,
            'dx-scheduler-work-space-both-scrollbar': true,
            'dx-scheduler-work-space-virtual': false,
          });
      });

      it('should not assign vertical-grouped class when default group orientation is "vertical"', () => {
        const workSpace = new WorkSpace({
          ...new WorkSpaceProps(),
          type: 'timelineDay',
          crossScrollingEnabled: true,
          groups,
          groupOrientation: 'vertical',
        } as any);

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        workSpace.classes;

        expect(combineClasses)
          .toBeCalledWith({
            'dx-scheduler-timeline-day dx-scheduler-timeline': true,
            'dx-scheduler-work-space-count': false,
            'dx-scheduler-work-space-odd-cells': false,
            'dx-scheduler-work-space-all-day-collapsed': false,
            'dx-scheduler-work-space-all-day': false,
            'dx-scheduler-work-space-group-by-date': false,
            'dx-scheduler-work-space-grouped': true,
            'dx-scheduler-work-space-vertical-grouped': false,
            'dx-scheduler-work-space-horizontal-grouped': false,
            'dx-scheduler-group-column-count-one': true,
            'dx-scheduler-group-column-count-two': false,
            'dx-scheduler-group-column-count-three': false,
            'dx-scheduler-work-space': true,
            'dx-scheduler-work-space-both-scrollbar': true,
            'dx-scheduler-work-space-virtual': false,
          });
      });

      it('should assign horizontal-grouped class when default group orientation is "vertical" and horizontal grouping is used', () => {
        const workSpace = new WorkSpace({
          ...new WorkSpaceProps(),
          type: 'timelineDay',
          crossScrollingEnabled: true,
          groups,
          groupOrientation: 'horizontal',
        } as any);

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        workSpace.classes;

        expect(combineClasses)
          .toBeCalledWith({
            'dx-scheduler-timeline-day dx-scheduler-timeline': true,
            'dx-scheduler-work-space-count': false,
            'dx-scheduler-work-space-odd-cells': false,
            'dx-scheduler-work-space-all-day-collapsed': false,
            'dx-scheduler-work-space-all-day': false,
            'dx-scheduler-work-space-group-by-date': false,
            'dx-scheduler-work-space-grouped': true,
            'dx-scheduler-work-space-vertical-grouped': false,
            'dx-scheduler-work-space-horizontal-grouped': true,
            'dx-scheduler-group-column-count-one': false,
            'dx-scheduler-group-column-count-two': false,
            'dx-scheduler-group-column-count-three': false,
            'dx-scheduler-work-space': true,
            'dx-scheduler-work-space-both-scrollbar': true,
            'dx-scheduler-work-space-virtual': false,
          });
      });

      it('should assign virtual scrolling class when scrolling is virtual', () => {
        const workSpace = new WorkSpace({
          ...new WorkSpaceProps(),
          type: 'timelineDay',
          crossScrollingEnabled: true,
          groups,
          groupOrientation: 'horizontal',
          scrolling: { mode: 'virtual' },
        } as any);

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        workSpace.classes;

        expect(combineClasses)
          .toBeCalledWith({
            'dx-scheduler-timeline-day dx-scheduler-timeline': true,
            'dx-scheduler-work-space-count': false,
            'dx-scheduler-work-space-odd-cells': false,
            'dx-scheduler-work-space-all-day-collapsed': false,
            'dx-scheduler-work-space-all-day': false,
            'dx-scheduler-work-space-group-by-date': false,
            'dx-scheduler-work-space-grouped': true,
            'dx-scheduler-work-space-vertical-grouped': false,
            'dx-scheduler-work-space-horizontal-grouped': true,
            'dx-scheduler-group-column-count-one': false,
            'dx-scheduler-group-column-count-two': false,
            'dx-scheduler-group-column-count-three': false,
            'dx-scheduler-work-space': true,
            'dx-scheduler-work-space-both-scrollbar': true,
            'dx-scheduler-work-space-virtual': true,
          });
      });
    });

    describe('isCalculateTablesWidth', () => {
      it('should return true for ordinary views with cross-scrolling', () => {
        const workSpace = new WorkSpace({
          ...new WorkSpaceProps(),
          type: 'day',
          crossScrollingEnabled: true,
        } as any);

        expect(workSpace.isCalculateTablesWidth)
          .toBe(true);
      });

      it('should return false for timeline views with cross-scrolling', () => {
        const workSpace = new WorkSpace({
          ...new WorkSpaceProps(),
          type: 'timelineWeek',
          crossScrollingEnabled: true,
        } as any);

        expect(workSpace.isCalculateTablesWidth)
          .toBe(false);
      });

      it('should return false for ordinary views without cross-scrolling', () => {
        const workSpace = new WorkSpace({
          ...new WorkSpaceProps(),
          type: 'week',
          crossScrollingEnabled: false,
        } as any);

        expect(workSpace.isCalculateTablesWidth)
          .toBe(false);
      });

      it('should return false for timeline views without cross-scrolling', () => {
        const workSpace = new WorkSpace({
          ...new WorkSpaceProps(),
          type: 'timelineWeek',
          crossScrollingEnabled: false,
        } as any);

        expect(workSpace.isCalculateTablesWidth)
          .toBe(false);
      });
    });
  });
});
