import { ViewProps } from '../../props';
import { ViewType } from '../../types';
import { getCurrentViewConfig, getCurrentViewProps } from '../views';

describe('Model views', () => {
  describe('getCurrentViewProps', () => {
    it('should find current view when views is an array of strings', () => {
      const views: ViewType[] = ['day', 'week', 'month'];

      expect(getCurrentViewProps('week', views))
        .toEqual({ type: 'week' });
    });

    it('should find current view when views is an array of objects', () => {
      const views: ViewProps[] = [{
        type: 'day',
      }, {
        type: 'week',
      }, {
        type: 'month',
      }];

      expect(getCurrentViewProps('week', views))
        .toBe(views[1]);
    });

    it('should find current view when a name is used', () => {
      const views: ViewProps[] = [{
        type: 'day',
        name: 'Day',
      }, {
        type: 'week',
        name: 'Week',
      }, {
        type: 'month',
        name: 'Month',
      }];

      expect(getCurrentViewProps('Week', views))
        .toBe(views[1]);
    });

    it('should convert current view to view type if it was not found in views', () => {
      const views: ViewProps[] = [{
        type: 'day',
        name: 'Day',
      }, {
        type: 'week',
        name: 'Week',
      }, {
        type: 'month',
        name: 'Month',
      }];

      expect(getCurrentViewProps('timelineWeek', views))
        .toEqual({ type: 'timelineWeek' });
    });

    it('should return the first view if current views cannot be found and it is not a view type', () => {
      const views: ViewProps[] = [{
        type: 'day',
        name: 'Day',
      }, {
        type: 'week',
        name: 'Week',
      }, {
        type: 'month',
        name: 'Month',
      }];

      expect(getCurrentViewProps('TimelineWeek', views))
        .toBe(views[0]);
    });
  });

  describe('getCurrentViewConfig', () => {
    it('should work when currentViewProps contains only type', () => {
      const schedulerProps = {
        firstDayOfWeek: 3,
        startDayHour: 5,
        endDayHour: 8,
        cellDuration: 15,
        groupByDate: true,
        currentDate: new Date(2021, 8, 10),
        showAllDayPanel: true,
        showCurrentTimeIndicator: true,
        indicatorUpdateInterval: 3000,
        shadeUntilCurrentTime: true,
        crossScrollingEnabled: true,
        height: 500,
        width: 500,
        scrolling: { mode: 'standard' },

        tabIndex: 3,
        accessKey: undefined,
        focusStateEnabled: true,

        dateCellTemplate: jest.fn(),
        dataCellTemplate: jest.fn(),
        timeCellTemplate: jest.fn(),
        resourceCellTemplate: jest.fn(),
      } as any;

      const { height, width, ...viewProps } = schedulerProps;

      expect(getCurrentViewConfig({ type: 'week' }, schedulerProps, schedulerProps.currentDate))
        .toEqual({
          ...viewProps,
          hoursInterval: 0.25,
          type: 'week',
          intervalCount: undefined,
          startDate: undefined,
          groupOrientation: undefined,
          schedulerHeight: 500,
          schedulerWidth: 500,
          allDayPanelExpanded: true,
          allowMultipleCellSelection: true,
        });
    });

    it('should work when currentViewProps contains many fields', () => {
      const schedulerProps = {
        firstDayOfWeek: 3,
        startDayHour: 5,
        endDayHour: 8,
        cellDuration: 15,
        groupByDate: true,
        currentDate: new Date(2021, 8, 10),
        showAllDayPanel: true,
        showCurrentTimeIndicator: true,
        indicatorUpdateInterval: 3000,
        shadeUntilCurrentTime: true,
        crossScrollingEnabled: true,
        height: 500,
        width: 500,
        scrolling: { mode: 'standard' },

        tabIndex: 3,
        accessKey: undefined,
        focusStateEnabled: true,

        dateCellTemplate: jest.fn(),
        dataCellTemplate: jest.fn(),
        timeCellTemplate: jest.fn(),
        resourceCellTemplate: jest.fn(),
      } as any;
      const currentViewProps = {
        firstDayOfWeek: 1,
        startDayHour: 0,
        endDayHour: 2,
        cellDuration: 300,
        groupByDate: false,
        intervalCount: 123,
        groupOrientation: 'vertical',
        startDate: new Date(2021, 8, 10),
        type: 'month',
        scrolling: { mode: 'virtual' },

        dateCellTemplate: jest.fn(),
        dataCellTemplate: jest.fn(),
        timeCellTemplate: jest.fn(),
        resourceCellTemplate: jest.fn(),
      } as any;

      const { height, width, ...viewProps } = schedulerProps;

      expect(getCurrentViewConfig(currentViewProps, schedulerProps, schedulerProps.currentDate))
        .toEqual({
          ...viewProps,
          ...currentViewProps,
          hoursInterval: 5,
          schedulerHeight: 500,
          schedulerWidth: 500,
          allDayPanelExpanded: true,
          allowMultipleCellSelection: true,
        });
    });

    it('should work correctly with virtual scrolling (set crossScrolling to true)', () => {
      const schedulerProps = {
        firstDayOfWeek: 3,
        startDayHour: 5,
        endDayHour: 8,
        cellDuration: 15,
        groupByDate: true,
        currentDate: new Date(2021, 8, 10),
        showAllDayPanel: true,
        showCurrentTimeIndicator: true,
        indicatorUpdateInterval: 3000,
        shadeUntilCurrentTime: true,
        crossScrollingEnabled: false,
        height: 500,
        width: 500,
        scrolling: { mode: 'virtual' },

        tabIndex: 3,
        accessKey: undefined,
        focusStateEnabled: true,
      } as any;
      const currentViewProps = {
        type: 'month',
      } as any;

      const { height, width, ...viewProps } = schedulerProps;

      expect(getCurrentViewConfig(currentViewProps, schedulerProps, schedulerProps.currentDate))
        .toEqual({
          ...viewProps,
          ...currentViewProps,
          hoursInterval: 0.25,
          schedulerHeight: 500,
          schedulerWidth: 500,
          allDayPanelExpanded: true,
          allowMultipleCellSelection: true,
          crossScrollingEnabled: true,
        });
    });

    it('should set crossScrolling to true when virtual scrolling is specified in currentViewProps', () => {
      const schedulerProps = {
        firstDayOfWeek: 3,
        startDayHour: 5,
        endDayHour: 8,
        cellDuration: 15,
        groupByDate: true,
        currentDate: new Date(2021, 8, 10),
        showAllDayPanel: true,
        showCurrentTimeIndicator: true,
        indicatorUpdateInterval: 3000,
        shadeUntilCurrentTime: true,
        crossScrollingEnabled: false,
        height: 500,
        width: 500,
        scrolling: { mode: 'standard' },
      } as any;
      const currentViewProps = {
        type: 'month',
        scrolling: { mode: 'virtual' },
      } as any;

      const { height, width, ...viewProps } = schedulerProps;

      expect(getCurrentViewConfig(currentViewProps, schedulerProps, schedulerProps.currentDate))
        .toEqual({
          ...viewProps,
          ...currentViewProps,
          hoursInterval: 0.25,
          schedulerHeight: 500,
          schedulerWidth: 500,
          allDayPanelExpanded: true,
          allowMultipleCellSelection: true,
          crossScrollingEnabled: true,
        });
    });

    it('return correct templates when some of them are null (in angular defulat templates are nulls)', () => {
      const dataCellTemplate = () => null;
      const dateCellTemplate = () => null;
      const timeCellTemplate = () => null;
      const resourceCellTemplate = () => null;
      const appointmentTemplate = () => null;
      const appointmentCollectorTemplate = () => null;
      const appointmentTooltipTemplate = () => null;

      const schedulerProps = {
        firstDayOfWeek: 3,
        startDayHour: 5,
        endDayHour: 8,
        cellDuration: 15,
        groupByDate: true,
        currentDate: new Date(2021, 8, 10),
        showAllDayPanel: true,
        showCurrentTimeIndicator: true,
        indicatorUpdateInterval: 3000,
        shadeUntilCurrentTime: true,
        crossScrollingEnabled: false,
        height: 500,
        width: 500,
        scrolling: { mode: 'standard' },
        dataCellTemplate,
        dateCellTemplate,
        timeCellTemplate,
        resourceCellTemplate,
        appointmentTemplate,
        appointmentCollectorTemplate,
        appointmentTooltipTemplate,
      } as any;
      const currentViewProps = {
        type: 'month',
        dataCellTemplate: null,
        dateCellTemplate: null,
        timeCellTemplate: null,
        resourceCellTemplate: null,
        appointmentTemplate: null,
        appointmentCollectorTemplate: null,
        appointmentTooltipTemplate: null,
      } as any;

      const { height, width, ...viewProps } = schedulerProps;

      expect(getCurrentViewConfig(currentViewProps, schedulerProps, schedulerProps.currentDate))
        .toEqual({
          ...viewProps,
          ...currentViewProps,
          hoursInterval: 0.25,
          schedulerHeight: 500,
          schedulerWidth: 500,
          allDayPanelExpanded: true,
          allowMultipleCellSelection: true,
          dataCellTemplate,
          dateCellTemplate,
          timeCellTemplate,
          resourceCellTemplate,
          appointmentTemplate,
          appointmentCollectorTemplate,
          appointmentTooltipTemplate,
        });
    });
  });
});
