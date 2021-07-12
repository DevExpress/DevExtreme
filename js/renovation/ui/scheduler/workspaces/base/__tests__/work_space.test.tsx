import React from 'react';
import { shallow } from 'enzyme';
import { VERTICAL_GROUP_ORIENTATION } from '../../../consts';
import { OrdinaryLayout } from '../ordinary_layout';
import {
  viewFunction as WorkSpaceLayout,
  WorkSpaceBase,
  WorkSpaceBaseProps,
} from '../work_space';

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
      };
      const viewModel = {
        dateHeaderData,
        viewData,
        timePanelData,
        isAllDayPanelVisible: true,
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
          ...viewModel,
          ...props,
          isAllDayPanelCollapsed: true,
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
          });

          expect(workSpace.layout)
            .toBe(OrdinaryLayout);
        });

        it('should return cross-scrolling layout if crossScrolling is enabled', () => {
          const workSpace = new WorkSpaceBase({
            currentDate: new Date(),
            crossScrollingEnabled: true,
          });

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
          });

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
          });

          expect(workSpace.isAllDayPanelVisible)
            .toBe(false);
        });

        it('should return true when all-day panel is supported and showAllDayPanel is true', () => {
          const workSpace = new WorkSpaceBase({
            currentDate: new Date(),
            isAllDayPanelSupported: true,
            showAllDayPanel: true,
          });

          expect(workSpace.isAllDayPanelVisible)
            .toBe(true);
        });
      });

      describe('viewData', () => {
        it('should return correct viewData', () => {
          const workSpace = new WorkSpaceBase({
            currentDate: new Date(),
          });

          expect(!!workSpace.viewData)
            .toBe(true);
        });
      });

      describe('dateHeaderData', () => {
        it('should return correct viewData', () => {
          const workSpace = new WorkSpaceBase({
            currentDate: new Date(),
          });

          expect(!!workSpace.dateHeaderData)
            .toBe(true);
        });
      });

      describe('timePanelData', () => {
        it('should return correct viewData', () => {
          const workSpace = new WorkSpaceBase({
            currentDate: new Date(),
          });

          expect(!!workSpace.timePanelData)
            .toBe(true);
        });
      });
    });
  });
});
