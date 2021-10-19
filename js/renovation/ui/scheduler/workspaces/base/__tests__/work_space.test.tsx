import React from 'react';
import { shallow } from 'enzyme';
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
import { TimePanelTableLayout } from '../time_panel/layout';

import { combineClasses } from '../../../../../utils/combine_classes';
import * as Utils from '../../utils';
import { CrossScrollingLayout } from '../cross_scrolling_layout';

jest.mock('../../../../../utils/combine_classes', () => ({
  combineClasses: jest.fn(),
}));
const isVerticalGroupingApplied = jest.spyOn(Utils, 'isVerticalGroupingApplied');

const mockUpdate = jest.fn();
const mockGetGroupPanelData = jest.fn().mockImplementation(() => ({}));
const mockViewDataProvider = {
  update: mockUpdate,
  getGroupPanelData: mockGetGroupPanelData,
  getCellCount: () => 7,
};
jest.mock('../../../../../../ui/scheduler/workspaces/view_model/view_data_provider', () => jest.fn().mockImplementation(() => mockViewDataProvider));

const getViewRenderConfigByType = jest.spyOn(ConfigUtils, 'getViewRenderConfigByType');

describe('WorkSpace', () => {
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
    const Layout = (props) => <div {...props} />;
    const headerPanelTemplate = () => null;
    const dateTableTemplate = () => null;
    const timePanelTemplate = () => null;
    const renderConfig = {
      className: 'custom',
      isRenderDateHeader: true,
      scrollingDirection: 'vertical',
      groupPanelClassName: 'dx-scheduler-group-table',
    };

    const renderComponent = (viewModel) => shallow(WorkSpaceLayout({
      layout: Layout,
      renderConfig,
      headerPanelTemplate,
      dateTableTemplate,
      timePanelTemplate,
      ...viewModel,
    }) as any);

    it('should pass correct props to the root component', () => {
      const props = {
        dataCellTemplate: () => null,
        dateCellTemplate: () => null,
        timeCellTemplate: () => null,
        resourceCellTemplate: () => null,

        groups,
        groupByDate: false,
        groupOrientation: VERTICAL_GROUP_ORIENTATION,
        intervalCount: 1,
      };
      const viewDataProvider = {
        dateHeaderData,
        viewData,
        timePanelData,
      };
      const viewModel = {
        viewDataProvider,
        isAllDayPanelVisible: true,
        isRenderHeaderEmptyCell: true,
        groupPanelData: {
          baseColSpan: 5,
          groupPanelItems: [],
        },
        classes: 'custom-classes',
        groupPanelHeight: 500,
        headerEmptyCellWidth: 300,

        timePanelRef: 'timePanelRef',
        groupPanelRef: 'groupPanelRef',
        dateTableRef: 'dateTableRef',
        allDayPanelRef: 'allDayPanelRef',
      };

      const workSpace = renderComponent({
        ...viewModel,
        props: {
          ...new WorkSpaceProps(),
          ...props,
          allDayPanelExpanded: false,
        },
      });

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
          ...renderConfig,
          headerPanelTemplate,
          dateTableTemplate,
          timePanelTemplate,
          className: 'custom-classes',
          groupPanelHeight: 500,
          headerEmptyCellWidth: 300,
          timePanelRef: 'timePanelRef',
          groupPanelRef: 'groupPanelRef',
          dateTableRef: 'dateTableRef',
          allDayPanelRef: 'allDayPanelRef',
        });
    });
  });

  describe('Behaviour', () => {
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

          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            onViewRendered,
            currentDate: new Date(),
            startDayHour: 0,
            endDayHour: 1,
            showAllDayPanel: false,
          });

          workSpace.dateTableRef = dateTableRefMock;
          workSpace.allDayPanelRef = { current: null } as any;

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
            });
        });

        it('should call onViewRendered with correct parameters when all-day panel is visible', () => {
          const onViewRendered = jest.fn();

          const workSpace = new WorkSpace({
            ...new WorkSpaceProps(),
            onViewRendered,
            currentDate: new Date(),
            startDayHour: 0,
            endDayHour: 1,
            showAllDayPanel: false,
          });

          workSpace.dateTableRef = dateTableRefMock;
          workSpace.allDayPanelRef = allDayPanelRefMock;

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
            });
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
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('layout', () => {
        it('should return ordinary layout if crossScrolling is not enabled', () => {
          const workSpace = new WorkSpace({
            currentDate: new Date(),
            crossScrollingEnabled: false,
            type: 'week',
          } as any);

          expect(workSpace.layout)
            .toBe(OrdinaryLayout);
        });

        it('should return cross-scrolling layout if crossScrolling is enabled', () => {
          const workSpace = new WorkSpace({
            currentDate: new Date(),
            crossScrollingEnabled: true,
            type: 'week',
          } as any);

          expect(workSpace.layout)
            .toBe(CrossScrollingLayout);
        });
      });

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

      describe('viewData', () => {
        it('should return correct viewData', () => {
          const workSpace = new WorkSpace({
            currentDate: new Date(),
            type: 'week',
          } as any);

          expect(!!workSpace.viewData)
            .toBe(true);
        });
      });

      describe('dateHeaderData', () => {
        it('should return correct dateHeaderData', () => {
          const workSpace = new WorkSpace({
            currentDate: new Date(),
            type: 'week',
          } as any);

          expect(!!workSpace.dateHeaderData)
            .toBe(true);
        });
      });

      describe('timePanelData', () => {
        it('should return correct timePanelData', () => {
          const workSpace = new WorkSpace({
            currentDate: new Date(),
            type: 'week',
          } as any);

          expect(!!workSpace.timePanelData)
            .toBe(true);
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
            ...props,
            type: 'week',
          });

          expect(workSpace.viewDataProvider)
            .toBe(mockViewDataProvider);

          expect(mockUpdate)
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
            }, true);
        });
      });

      describe('groupPanelData', () => {
        beforeEach(() => {
          jest.clearAllMocks();
        });

        it('should return correct group panel data', () => {
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
            ...props,
            type: 'week',
          });

          expect(workSpace.groupPanelData)
            .toEqual({});

          expect(mockGetGroupPanelData)
            .toHaveBeenCalledWith({
              ...props,
              startRowIndex: 0,
              startCellIndex: 0,
              isAllDayPanelVisible: undefined,
              viewType: 'week',
              getDateForHeaderText: expect.any(Function),
              headerCellTextFormat: expect.any(Function),
              isGenerateTimePanelData: true,
              isGenerateWeekDaysHeaderData: false,
              isProvideVirtualCellsWidth: false,
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
              timePanelTemplate: TimePanelTableLayout,
              isAllDayPanelSupported: true,
              isProvideVirtualCellsWidth: false,
              isRenderTimePanel: true,
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
            .toBeCalledWith('week', true, 3, true);
        });
      });

      describe('headerPanelTemplate', () => {
        it('should return correct HeaderPanelLayout', () => {
          const workSpace = new WorkSpace({
            type: 'week',
            intervalCount: 3,
          } as any);

          expect(workSpace.headerPanelTemplate)
            .toBe(HeaderPanelLayout);
        });
      });

      describe('dateTableTemplate', () => {
        it('should return correct dateTableTemplate', () => {
          const workSpace = new WorkSpace({
            type: 'week',
            intervalCount: 3,
          } as any);

          expect(workSpace.dateTableTemplate)
            .toBe(DateTableLayoutBase);
        });
      });

      describe('timePanelTemplate', () => {
        it('should return correct timePanelTemplate', () => {
          const workSpace = new WorkSpace({
            type: 'week',
            intervalCount: 3,
          } as any);

          expect(workSpace.timePanelTemplate)
            .toBe(TimePanelTableLayout);
        });
      });

      describe('isVerticalGrouping', () => {
        it('should call isVerticalGroupingApplied', () => {
          const workSpace = new WorkSpace({
            groups,
            groupOrientation: 'vertical',
          } as any);

          const result = workSpace.isVerticalGrouping;

          expect(result)
            .toBe(true);
          expect(isVerticalGroupingApplied)
            .toBeCalledWith(groups, 'vertical');
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
    });

    describe('classes', () => {
      // afterEach(jest.resetAllMocks);

      it('should call combineClasses with correct parameters', () => {
        const workSpace = new WorkSpace({
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
            'dx-scheduler-work-space-group-by-date': true,
            'dx-scheduler-work-space-grouped': true,
            'dx-scheduler-work-space-vertical-grouped': true,
            'dx-scheduler-group-column-count-one': true,
            'dx-scheduler-group-column-count-two': false,
            'dx-scheduler-group-column-count-three': false,
            'dx-scheduler-work-space': true,
          });
      });

      it('should call combineClasses with correct parameters when all-day panel is not collapsed', () => {
        const workSpace = new WorkSpace({
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
            'dx-scheduler-work-space-group-by-date': true,
            'dx-scheduler-work-space-grouped': true,
            'dx-scheduler-work-space-vertical-grouped': true,
            'dx-scheduler-group-column-count-one': true,
            'dx-scheduler-group-column-count-two': false,
            'dx-scheduler-group-column-count-three': false,
            'dx-scheduler-work-space': true,
          });
      });

      it('should call combineClasses with correct parameters when all-day panel is not visible', () => {
        const workSpace = new WorkSpace({
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
            'dx-scheduler-work-space-group-by-date': true,
            'dx-scheduler-work-space-grouped': true,
            'dx-scheduler-work-space-vertical-grouped': true,
            'dx-scheduler-group-column-count-one': true,
            'dx-scheduler-group-column-count-two': false,
            'dx-scheduler-group-column-count-three': false,
            'dx-scheduler-work-space': true,
          });
      });

      it('should call combineClasses with correct parameters when groups are empty', () => {
        const workSpace = new WorkSpace({
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
            'dx-scheduler-group-column-count-one': false,
            'dx-scheduler-group-column-count-two': false,
            'dx-scheduler-group-column-count-three': false,
            'dx-scheduler-work-space': true,
          });
      });

      it('should call combineClasses with correct parameters when groups are empty but groupOrientation is vertical', () => {
        const workSpace = new WorkSpace({
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
              'dx-scheduler-group-column-count-one': false,
              'dx-scheduler-group-column-count-two': false,
              'dx-scheduler-group-column-count-three': false,
              'dx-scheduler-work-space': true,
              'dx-scheduler-work-space-both-scrollbar': false,
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
            'dx-scheduler-group-column-count-one': false,
            'dx-scheduler-group-column-count-two': false,
            'dx-scheduler-group-column-count-three': false,
            'dx-scheduler-work-space': true,
            'dx-scheduler-work-space-both-scrollbar': true,
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
            'dx-scheduler-group-column-count-one': true,
            'dx-scheduler-group-column-count-two': false,
            'dx-scheduler-group-column-count-three': false,
            'dx-scheduler-work-space': true,
            'dx-scheduler-work-space-both-scrollbar': true,
          });
      });
    });
  });
});
