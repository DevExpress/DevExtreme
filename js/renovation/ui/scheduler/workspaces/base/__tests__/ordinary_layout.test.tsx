import { shallow, mount } from 'enzyme';
import React from 'react';
import { Scrollable } from '../../../../scroll_view/scrollable';
import { Widget } from '../../../../common/widget';
import {
  viewFunction as LayoutView,
} from '../ordinary_layout';
import { GroupPanel } from '../group_panel/group_panel';
import { AllDayPanelLayout, AllDayPanelLayoutProps } from '../date_table/all_day_panel/layout';
import { AllDayPanelTitle } from '../date_table/all_day_panel/title';
import { HeaderPanelEmptyCell } from '../header_panel_empty_cell';
import { MainLayoutProps } from '../main_layout_props';

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
        props: { className: 'custom-classes' },
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
          timePanelRef,
          ...props,
        },
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
        ...new MainLayoutProps(),
        groupOrientation: 'vertical',
        groups,
        resourceCellTemplate,
        isRenderGroupPanel: true,
        groupPanelHeight: 497,
        groupPanelRef,
      };
      const layout = render({
        props,
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
          className: 'dx-scheduler-work-space-vertical-group-table',
          groupPanelData: {
            groupPanelItems: [],
            baseColSpan: 1,
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
});
