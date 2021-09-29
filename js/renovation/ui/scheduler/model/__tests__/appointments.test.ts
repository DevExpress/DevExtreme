import ViewDataProvider from '../../../../../ui/scheduler/workspaces/view_model/view_data_provider';
import { SchedulerProps } from '../../props';
import { ViewType } from '../../types';
import { prepareGenerationOptions } from '../../workspaces/base/work_space';
import { getViewRenderConfigByType } from '../../workspaces/base/work_space_config';
import { WorkSpaceProps } from '../../workspaces/props';
import { CellsMetaData, ViewDataProviderType } from '../../workspaces/types';
import { getAppointmentsModel } from '../appointments';
import {
  createFactoryInstances,
  generateKey,
  getTimeZoneCalculator,
  getAppointmentDataProvider,
} from '../../../../../ui/scheduler/instanceFactory';

const prepareInstances = (
  viewType: ViewType,
  currentDate: Date,
  intervalCount: number,
): {
  key: number;
  timeZoneCalculator: any; // TODO add TimeZoneCalculator to the renovation
  appointmentDataProvider: any; // TODO add AppointmentDataProvider to the renovation
  schedulerProps: SchedulerProps;
  workspaceProps: WorkSpaceProps;
  viewDataProvider: ViewDataProviderType;
  DOMMetaData: CellsMetaData;
} => {
  const schedulerProps = new SchedulerProps();
  schedulerProps.currentDate = currentDate;
  const workspaceProps = new WorkSpaceProps();
  workspaceProps.type = viewType;
  workspaceProps.intervalCount = intervalCount;
  workspaceProps.currentDate = currentDate;

  // TODO: convert ViewdataProvider to TS
  const viewDataProvider = (new ViewDataProvider('week') as unknown) as ViewDataProviderType;
  const viewRenderConfig = getViewRenderConfigByType(
    workspaceProps.type,
    workspaceProps.intervalCount,
  );
  const generationOptions = prepareGenerationOptions(
    workspaceProps,
    viewRenderConfig,
    false,
  );
  viewDataProvider.update(generationOptions, true);
  const DOMMetaData = {
    dateTableCellsMeta: [],
    allDayPanelCellsMeta: [],
  };

  const key = generateKey();
  createFactoryInstances({
    key,
    getIsVirtualScrolling: () => false,
    getDataAccessors: () => ({
      getter: { },
      setter: { },
      expr: { },
    }),
  });

  return {
    key,
    timeZoneCalculator: getTimeZoneCalculator(key),
    appointmentDataProvider: getAppointmentDataProvider(key),
    viewDataProvider,
    schedulerProps,
    workspaceProps,
    DOMMetaData,
  };
};

describe('Model appointmnets', () => {
  describe('getAppointmentsModel', () => {
    const instances = prepareInstances(
      'week',
      new Date(2021, 8, 22),
      7,
    );

    const appointmentModel = getAppointmentsModel(
      0,
      instances.schedulerProps,
      instances.workspaceProps,
      instances.viewDataProvider,
      instances.DOMMetaData,
    );

    it('should contains correct appointment config', () => {
      expect(appointmentModel)
        .toMatchObject({
          key: 0,
          appointmentRenderingStrategyName: 'vertical',
          adaptivityEnabled: false,
          rtlEnabled: false,
          maxAppointmentsPerCell: 'auto',
          isVirtualScrolling: false,
          leftVirtualCellCount: 0,
          topVirtualCellCount: 0,
          modelGroups: [],
          groupCount: 0,
          dateTableOffset: 0,
          groupOrientation: 'horizontal',
          endViewDate: new Date('2021-11-06T23:59:00'),
          isGroupedByDate: false,
          cellWidth: 0,
          cellHeight: 0,
          allDayHeight: 0,
          visibleDayDuration: 86400000,
          timeZone: '',
          firstDayOfWeek: 0,
          viewType: 'week',
          cellDuration: 30,
          supportAllDayRow: false,
          dateRange: [
            new Date('2021-09-19T00:00:00'),
            new Date('2021-11-06T23:59:00'),
          ],
          intervalDuration: 4233600000,
          allDayIntervalDuration: 311040000000000,
          isVerticalGroupOrientation: false,
        });
    });

    it('should contains correct instances', () => {
      expect(appointmentModel.timeZoneCalculator)
        .toEqual(instances.timeZoneCalculator);

      expect(appointmentModel.appointmentDataProvider)
        .toEqual(instances.appointmentDataProvider);

      expect(appointmentModel.viewDataProvider)
        .toEqual(instances.viewDataProvider);

      expect(appointmentModel.DOMMetaData)
        .toEqual(instances.DOMMetaData);
    });
  });
});
