import ViewDataProvider from '../../../../../ui/scheduler/workspaces/view_model/view_data_provider';
import { SchedulerProps, ViewProps } from '../../props';
import { ViewType } from '../../types';
import { prepareGenerationOptions } from '../../workspaces/base/work_space';
import { getViewRenderConfigByType } from '../../workspaces/base/work_space_config';
import { WorkSpaceProps } from '../../workspaces/props';
import { CellsMetaData, Group, ViewDataProviderType } from '../../workspaces/types';
import { getAppointmentsConfig, getAppointmentsModel } from '../appointments';
import { AppointmentsConfigType } from '../types';
import { TimeZoneCalculator } from '../../timeZoneCalculator/utils';
import { getCurrentViewConfig } from '../views';
import { createTimeZoneCalculator } from '../../timeZoneCalculator/createTimeZoneCalculator';

const prepareInstances = (
  viewType: ViewType,
  currentDate: Date,
  intervalCount: number,
  supportAllDayRow: boolean,
  loadedResources: Group[],
): {
  appointmentsConfig: AppointmentsConfigType;
  timeZoneCalculator: TimeZoneCalculator;
  viewDataProvider: ViewDataProviderType;
  DOMMetaData: CellsMetaData;
} => {
  const schedulerProps: any = new SchedulerProps();
  schedulerProps.currentDate = currentDate;
  let workspaceProps = new WorkSpaceProps();
  workspaceProps.type = viewType;
  workspaceProps.intervalCount = intervalCount;
  workspaceProps.currentDate = currentDate;
  workspaceProps.startDate = currentDate;

  workspaceProps = {
    ...workspaceProps,
    ...getCurrentViewConfig(
      workspaceProps as unknown as Partial<ViewProps>,
      schedulerProps,
      currentDate,
    ),
    showAllDayPanel: supportAllDayRow,
  };

  // TODO: convert ViewdataProvider to TS
  const viewDataProvider = (new ViewDataProvider('week') as unknown) as ViewDataProviderType;
  const viewRenderConfig = getViewRenderConfigByType(
    workspaceProps.type,
    false,
    workspaceProps.intervalCount,
    [],
    'horizontal',
  );
  const generationOptions = prepareGenerationOptions(
    {
      ...workspaceProps,
      groupOrientation: 'horizontal',
    },
    viewRenderConfig,
    false,
    {
      startCellIndex: 0,
      startRowIndex: 0,
    },
  );
  viewDataProvider.update(generationOptions, true);

  const appointmentsConfig = getAppointmentsConfig(
    schedulerProps,
    workspaceProps,
    loadedResources,
    viewDataProvider,
    supportAllDayRow,
  );

  return {
    appointmentsConfig,
    timeZoneCalculator: createTimeZoneCalculator('America/Los_Angeles'),
    viewDataProvider,
    DOMMetaData: [] as any,
  };
};

describe('Appointments model', () => {
  [
    [],
    [
      { items: [{ id: 1 }] },
      { items: [{ id: 2 }] },
    ],
  ].forEach((loadedResources) => {
    [true, false].forEach((supportAllDayRow) => {
      describe(`getAppointmentsModel if supportAllDayPanel is ${supportAllDayRow} and loaded resources is ${!!loadedResources.length}`, () => {
        const instances = prepareInstances(
          'week',
          new Date(2021, 8, 22),
          7,
          supportAllDayRow,
          loadedResources as Group[],
        );

        const appointmentsModel = getAppointmentsModel(
          instances.appointmentsConfig,
          instances.viewDataProvider,
          instances.timeZoneCalculator,
          { } as any,
          instances.DOMMetaData,
        );

        it('should be creared correctly', () => {
          expect(appointmentsModel)
            .toMatchObject({
              adaptivityEnabled: false,
              rtlEnabled: undefined,
              startDayHour: 0,
              viewStartDayHour: 0, // TODO remove
              endDayHour: 24,
              viewEndDayHour: 24, // TODO remove
              resources: [],
              maxAppointmentsPerCell: 'auto',
              currentDate: new Date('2021-09-22T00:00:00'),
              isVirtualScrolling: false,
              intervalCount: 7,
              hoursInterval: 0.5,
              showAllDayPanel: supportAllDayRow,
              groups: [],
              appointmentCountPerCell: 2, // TODO default
              appointmentOffset: 26, // TODO default
              allowResizing: false, // TODO resizing
              allowAllDayResizing: false, // TODO resizing
              dateTableOffset: 0,
              groupOrientation: 'horizontal',
              startViewDate: new Date(2021, 8, 19),
              timeZone: '',
              firstDayOfWeek: 0,
              viewType: 'week',
              cellDurationInMinutes: 30,
              supportAllDayRow,
              isVerticalGroupOrientation: false,
              loadedResources,
              intervalDuration: 1800000,
              allDayIntervalDuration: 86400000,
            });
        });

        it('should contains correct instances', () => {
          expect(appointmentsModel.timeZoneCalculator)
            .toEqual(instances.timeZoneCalculator);

          expect(appointmentsModel.viewDataProvider)
            .toEqual(instances.viewDataProvider);

          expect(appointmentsModel.DOMMetaData)
            .toEqual(instances.DOMMetaData);
        });
      });
    });
  });
});
