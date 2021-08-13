import React from 'react';
import { shallow } from 'enzyme';
import { VERTICAL_GROUP_ORIENTATION } from '../../../consts';
import { OrdinaryLayout } from '../ordinary_layout';
import {
  viewFunction as WorkSpaceLayout,
  WorkSpaceBase,
  WorkSpaceBaseProps,
} from '../work_space';

const mockUpdate = jest.fn();
const mockGetGroupPanelData = jest.fn().mockImplementation(() => ({}));
const mockViewDataProvider = {
  update: mockUpdate,
  getGroupPanelData: mockGetGroupPanelData,
  getCellCount: () => 7,
};
jest.mock('../../../../../../ui/scheduler/workspaces/view_model/view_data_provider', () => jest.fn().mockImplementation(() => mockViewDataProvider));

describe('WorkSpaceBase', () => {
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

    const renderComponent = (viewModel) => shallow(WorkSpaceLayout({
      layout: Layout,
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
        isAllDayPanelSupported: false,

        headerPanelTemplate: () => null,
        dateTableTemplate: () => null,
        timePanelTemplate: () => null,
        className: 'custom',
      };
      const viewDataProvider = {
        dateHeaderData,
        viewData,
        timePanelData,
      };
      const viewModel = {
        viewDataProvider,
        isAllDayPanelVisible: true,
        groupPanelData: {
          baseColSpan: 5,
          groupPanelItems: [],
        },
      };

      const workSpace = renderComponent({
        ...viewModel,
        props: {
          ...new WorkSpaceBaseProps(),
          ...props,
          allDayPanelExpanded: false,
        },
      });

      expect(workSpace.props())
        .toEqual({
          ...props,
          isAllDayPanelCollapsed: true,
          isAllDayPanelVisible: true,
          dateHeaderData,
          viewData,
          timePanelData,
          groupPanelData: {
            baseColSpan: 5,
            groupPanelItems: [],
          },
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

          const workSpace = new WorkSpaceBase({
            ...new WorkSpaceBaseProps(),
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

          const workSpace = new WorkSpaceBase({
            ...new WorkSpaceBaseProps(),
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
    });
  });

  describe('Logic', () => {
    describe('Getters', () => {
      describe('layout', () => {
        it('should return ordinary layout if crossScrolling is not enabled', () => {
          const workSpace = new WorkSpaceBase({
            currentDate: new Date(),
            crossScrollingEnabled: false,
          } as any);

          expect(workSpace.layout)
            .toBe(OrdinaryLayout);
        });

        it('should return cross-scrolling layout if crossScrolling is enabled', () => {
          const workSpace = new WorkSpaceBase({
            currentDate: new Date(),
            crossScrollingEnabled: true,
          } as any);

          expect(workSpace.layout)
            .toBe(OrdinaryLayout); // TODO: CrossScrollingLayout
        });
      });

      describe('isAllDayPanelVisible', () => {
        it('should return false when all-day panel is not supported', () => {
          const workSpace = new WorkSpaceBase({
            currentDate: new Date(),
            isAllDayPanelSupported: false,
            showAllDayPanel: false,
          } as any);

          expect(workSpace.isAllDayPanelVisible)
            .toBe(false);

          workSpace.props.showAllDayPanel = true;

          expect(workSpace.isAllDayPanelVisible)
            .toBe(false);
        });

        it('should return false when all-day panel is supported but showAllDayPanel is false', () => {
          const workSpace = new WorkSpaceBase({
            currentDate: new Date(),
            isAllDayPanelSupported: true,
            showAllDayPanel: false,
          } as any);

          expect(workSpace.isAllDayPanelVisible)
            .toBe(false);
        });

        it('should return true when all-day panel is supported and showAllDayPanel is true', () => {
          const workSpace = new WorkSpaceBase({
            currentDate: new Date(),
            isAllDayPanelSupported: true,
            showAllDayPanel: true,
          } as any);

          expect(workSpace.isAllDayPanelVisible)
            .toBe(true);
        });
      });

      describe('viewData', () => {
        it('should return correct viewData', () => {
          const workSpace = new WorkSpaceBase({
            currentDate: new Date(),
          } as any);

          expect(!!workSpace.viewData)
            .toBe(true);
        });
      });

      describe('dateHeaderData', () => {
        it('should return correct dateHeaderData', () => {
          const workSpace = new WorkSpaceBase({
            currentDate: new Date(),
          } as any);

          expect(!!workSpace.dateHeaderData)
            .toBe(true);
        });
      });

      describe('timePanelData', () => {
        it('should return correct timePanelData', () => {
          const workSpace = new WorkSpaceBase({
            currentDate: new Date(),
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
            isProvideVirtualCellsWidth: false,
            selectedCells: undefined,
            focusedCell: undefined,
            headerCellTextFormat: () => 'shorttime',
            startDayHour: 0,
            endDayHour: 24,
            cellDuration: 30,
            intervalCount: 1,
            hoursInterval: 0.5,
            currentDate: new Date(2021, 8, 11),
            startDate: null,
            firstDayOfWeek: 0,

            isGenerateTimePanelData: true,
          };

          const workSpace = new WorkSpaceBase({
            ...new WorkSpaceBaseProps(),
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
            isProvideVirtualCellsWidth: false,
            selectedCells: undefined,
            focusedCell: undefined,
            headerCellTextFormat: () => 'shorttime',
            getDateForHeaderText: () => new Date(),
            startDayHour: 0,
            endDayHour: 24,
            cellDuration: 30,
            intervalCount: 1,
            hoursInterval: 0.5,
            currentDate: new Date(2021, 8, 11),
            startDate: null,
            firstDayOfWeek: 0,

            isGenerateTimePanelData: true,
          };

          const workSpace = new WorkSpaceBase({
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
            });
        });
      });
    });
  });
});
