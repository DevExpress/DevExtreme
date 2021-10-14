import ViewDataProvider from '../../../../../../ui/scheduler/workspaces/view_model/view_data_provider';
import { SchedulerProps } from '../../../props';
import { DataAccessorType, ViewType } from '../../../types';
import { prepareGenerationOptions } from '../../../workspaces/base/work_space';
import { getViewRenderConfigByType } from '../../../workspaces/base/work_space_config';
import { WorkSpaceProps } from '../../../workspaces/props';
import { CellsMetaData, ViewDataProviderType } from '../../../workspaces/types';
import { getAppointmentsViewModel } from '../appointments';
import { getAppointmentsConfig, getAppointmentsModel } from '../../../model/appointments';
import { compileGetter, compileSetter } from '../../../../../../core/utils/data';
import { createTimeZoneCalculator } from '../../../common';
import { AppointmentsConfigType } from '../../../model/types';
import { TimeZoneCalculator } from '../../../timeZoneCalculator/utils';

const defaultDataAccessors: DataAccessorType = {
  getter: {
    startDate: compileGetter('startDate') as any,
    endDate: compileGetter('endDate') as any,
  },
  setter: {
    startDate: compileSetter('startDate') as any,
    endDate: compileSetter('endDate') as any,
  },
  expr: {
    startDateExpr: 'startDate',
    endDateExpr: 'endDate',
  },
};

const prepareInstances = (
  viewType: ViewType,
  currentDate: Date,
  intervalCount: number,
): {
  appointmentsConfig: AppointmentsConfigType;
  timeZoneCalculator: TimeZoneCalculator;
  viewDataProvider: ViewDataProviderType;
  DOMMetaData: CellsMetaData;
} => {
  const schedulerProps = new SchedulerProps();
  schedulerProps.currentDate = currentDate;
  const workspaceProps = new WorkSpaceProps();
  workspaceProps.type = viewType;
  workspaceProps.intervalCount = intervalCount;
  workspaceProps.currentDate = currentDate;
  workspaceProps.startDate = currentDate;

  // TODO: convert ViewdataProvider to TS
  const viewDataProvider = (new ViewDataProvider('week') as unknown) as ViewDataProviderType;
  const viewRenderConfig = getViewRenderConfigByType(
    workspaceProps.type,
    workspaceProps.crossScrollingEnabled,
    workspaceProps.intervalCount,
    workspaceProps.groupOrientation === 'vertical',
  );
  const generationOptions = prepareGenerationOptions(
    workspaceProps,
    viewRenderConfig,
    false,
  );
  viewDataProvider.update(generationOptions, true);
  const DOMMetaData = {
    allDayPanelCellsMeta: [],
    dateTableCellsMeta: [
      [],
      [{
        left: 0, top: 0, width: 100, height: 200,
      }],
      [], [], [], [], [], [], [], [], [],
      [], [], [], [], [], [], [], [], [],
      [ // Row #20
        { }, { }, { }, { },
        { // Cell #4
          left: 100, top: 200, width: 50, height: 60,
        },
      ],
      [],
      [ // Row #22
        { }, { }, { }, { }, { },
        { // Cell #5
          left: 100, top: 300, width: 50, height: 60,
        },
      ],
    ],
  };

  const appointmentsConfig = getAppointmentsConfig(
    schedulerProps,
    workspaceProps,
    [],
    viewDataProvider,
  );

  const timeZoneCalculator = createTimeZoneCalculator('');

  return {
    timeZoneCalculator,
    viewDataProvider,
    appointmentsConfig,
    DOMMetaData: DOMMetaData as any,
  };
};

describe('Appointments view model', () => {
  const instances = prepareInstances(
    'week',
    new Date(2021, 8, 22),
    7,
  );

  const appointmentsModel = getAppointmentsModel(
    instances.appointmentsConfig,
    instances.viewDataProvider,
    instances.timeZoneCalculator,
    defaultDataAccessors,
    instances.DOMMetaData,
  );

  describe('getAppointmentsViewModel', () => {
    it('should be generated correctly', () => {
      const expectedViewModel0 = {
        appointment: {
          startDate: new Date(2021, 8, 23, 10),
          endDate: new Date(2021, 8, 23, 11),
        },
        geometry: {
          height: -200,
          width: 74,
          top: 200,
          left: 100,
          empty: true,
          leftVirtualWidth: 0,
          topVirtualHeight: 0,
        },
        info: {
          appointment: {
            startDate: new Date(2021, 8, 23, 10),
            endDate: new Date(2021, 8, 23, 11),
            source: {
              startDate: new Date(2021, 8, 23, 10),
              endDate: new Date(2021, 8, 23, 11),
              exceptionDate: new Date(2021, 8, 23, 10),
            },
            normalizedEndDate: new Date(2021, 8, 23, 11),
          },
          sourceAppointment: {
            startDate: new Date(2021, 8, 23, 10),
            endDate: new Date(2021, 8, 23, 11),
            exceptionDate: new Date(2021, 8, 23, 10),
          },
          dateText: '10:00 AM - 11:00 AM',
        },
      };
      const viewModel = getAppointmentsViewModel(
        appointmentsModel,
        [{
          startDate: new Date(2021, 8, 23, 10),
          endDate: new Date(2021, 8, 23, 11),
        }, {
          startDate: new Date(2021, 8, 24, 11),
          endDate: new Date(2021, 8, 24, 12),
        }],
      );

      expect(viewModel)
        .toHaveLength(4);

      expect(viewModel[0])
        .toMatchObject(expectedViewModel0);

      expect(viewModel[1])
        .toMatchObject({
          appointment: {
            startDate: new Date(2021, 8, 23, 10),
            endDate: new Date(2021, 8, 23, 11),
          },
          geometry: {
            height: 600,
            width: 74,
            top: 0,
            left: 200,
            empty: false,
            leftVirtualWidth: 0,
            topVirtualHeight: 0,
          },
          info: {
            appointment: {
              startDate: new Date(2021, 8, 23, 10),
              endDate: new Date(2021, 8, 23, 11),
              source: {
                startDate: new Date(2021, 8, 23, 10),
                endDate: new Date(2021, 8, 23, 11),
                exceptionDate: new Date(2021, 8, 23, 10),
              },
              normalizedEndDate: new Date(2021, 8, 23, 11),
            },
            sourceAppointment: {
              startDate: new Date(2021, 8, 23, 10),
              endDate: new Date(2021, 8, 23, 11),
              exceptionDate: new Date(2021, 8, 23, 10),
            },
            dateText: '10:00 AM - 11:00 AM',
          },
        });

      expect(viewModel[2])
        .toMatchObject({
          appointment: {
            startDate: new Date(2021, 8, 24, 11),
            endDate: new Date(2021, 8, 24, 12),
          },
          geometry: {
            height: -300,
            width: 74,
            top: 300,
            left: 100,
            empty: true,
            leftVirtualWidth: 0,
            topVirtualHeight: 0,
          },
          info: {
            appointment: {
              startDate: new Date(2021, 8, 24, 11),
              endDate: new Date(2021, 8, 24, 12),
              source: {
                startDate: new Date(2021, 8, 24, 11),
                endDate: new Date(2021, 8, 24, 12),
                exceptionDate: new Date(2021, 8, 24, 11),
              },
              normalizedEndDate: new Date(2021, 8, 24, 12),
            },
            sourceAppointment: {
              startDate: new Date(2021, 8, 24, 11),
              endDate: new Date(2021, 8, 24, 12),
              exceptionDate: new Date(2021, 8, 24, 11),
            },
            dateText: '11:00 AM - 12:00 PM',
          },
        });

      expect(viewModel[3])
        .toMatchObject({
          appointment: {
            startDate: new Date(2021, 8, 24, 11),
            endDate: new Date(2021, 8, 24, 12),
          },
          geometry: {
            height: 700,
            width: 74,
            top: 0,
            left: 274,
            empty: false,
            leftVirtualWidth: 0,
            topVirtualHeight: 0,
          },
          info: {
            appointment: {
              startDate: new Date(2021, 8, 24, 11),
              endDate: new Date(2021, 8, 24, 12),
              source: {
                startDate: new Date(2021, 8, 24, 11),
                endDate: new Date(2021, 8, 24, 12),
                exceptionDate: new Date(2021, 8, 24, 11),
              },
              normalizedEndDate: new Date(2021, 8, 24, 12),
            },
            sourceAppointment: {
              startDate: new Date(2021, 8, 24, 11),
              endDate: new Date(2021, 8, 24, 12),
              exceptionDate: new Date(2021, 8, 24, 11),
            },
            dateText: '11:00 AM - 12:00 PM',
          },
        });
    });
  });
});
