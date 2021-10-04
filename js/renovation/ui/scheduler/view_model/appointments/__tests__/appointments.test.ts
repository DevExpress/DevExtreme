import ViewDataProvider from '../../../../../../ui/scheduler/workspaces/view_model/view_data_provider';
import { SchedulerProps } from '../../../props';
import { DataAccessorType, ViewType } from '../../../types';
import { prepareGenerationOptions } from '../../../workspaces/base/work_space';
import { getViewRenderConfigByType } from '../../../workspaces/base/work_space_config';
import { WorkSpaceProps } from '../../../workspaces/props';
import { CellsMetaData, ViewDataProviderType } from '../../../workspaces/types';
import { getAppointmentsViewModel } from '../appointments';
import { getAppointmentsModel } from '../../../model/appointments';
import { compileGetter, compileSetter } from '../../../../../../core/utils/data';
import { createAppointmentDataProvider, createDataAccessors, createTimeZoneCalculator } from '../../../common';

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

  const timeZoneCalculator = createTimeZoneCalculator('');

  const appointmentDataProvider = createAppointmentDataProvider(
    schedulerProps,
    workspaceProps,
    false,
    [],
    createDataAccessors(schedulerProps),
    timeZoneCalculator,
    viewDataProvider,
  );

  return {
    timeZoneCalculator,
    appointmentDataProvider,
    viewDataProvider,
    schedulerProps,
    workspaceProps,
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
    instances.schedulerProps,
    instances.workspaceProps,
    instances.viewDataProvider,
    instances.timeZoneCalculator,
    instances.appointmentDataProvider,
    defaultDataAccessors,
    instances.DOMMetaData,
  );

  describe('getAppointmentsViewModel', () => {
    it('should be generated correctly', () => {
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

      expect(viewModel.positionMap)
        .toHaveLength(2);

      expect((viewModel.positionMap as any)[0])
        .toMatchObject([{
          allDay: false,
          appointmentReduced: null,
          cellPosition: 100,
          count: 1,
          dateSettingIndex: 0,
          direction: 'vertical',
          groupIndex: 0,
          hMax: 0,
          height: -200,
          index: 0,
          info: {
            appointment: {
              startDate: new Date(2021, 8, 23, 10),
              endDate: new Date(2021, 8, 23, 11),
              normalizedEndDate: new Date(2021, 8, 23, 11),
              source: {
                startDate: new Date(2021, 8, 23, 10),
                endDate: new Date(2021, 8, 23, 11),
                exceptionDate: new Date(2021, 8, 23, 10),
              },
            },
            dateText: '10:00 AM - 11:00 AM',
            resourceColor: undefined,
            sourceAppointment: {
              startDate: new Date(2021, 8, 23, 10),
              endDate: new Date(2021, 8, 23, 11),
              exceptionDate: new Date(2021, 8, 23, 10),
            },
          },
          left: 100,
          top: 200,
          leftVirtualCellCount: 0,
          leftVirtualWidth: 0,
          rowIndex: 20,
          columnIndex: 4,
          sortedIndex: 0,
          topVirtualCellCount: 0,
          topVirtualHeight: 0,
          vMax: 0,
          width: 0,
        }, {
          appointmentReduced: 'tail',
          cellPosition: 100,
          columnIndex: 5,
          count: 2,
          dateSettingIndex: 0,
          direction: 'vertical',
          groupIndex: 0,
          hMax: 0,
          height: 600,
          index: 0,
          info: {
            appointment: {
              startDate: new Date(2021, 8, 23, 10),
              endDate: new Date(2021, 8, 23, 11),
              normalizedEndDate: new Date(2021, 8, 23, 11),
              source: {
                startDate: new Date(2021, 8, 23, 10),
                endDate: new Date(2021, 8, 23, 11),
                exceptionDate: new Date(2021, 8, 23, 10),
              },
            },
            dateText: '10:00 AM - 11:00 AM',
            sourceAppointment: {
              startDate: new Date(2021, 8, 23, 10),
              endDate: new Date(2021, 8, 23, 11),
              exceptionDate: new Date(2021, 8, 23, 10),
            },
          },
          left: 200,
          leftVirtualCellCount: 0,
          leftVirtualWidth: 0,
          rowIndex: 0,
          sortedIndex: 2,
          top: 0,
          topVirtualCellCount: 0,
          topVirtualHeight: 0,
          vMax: 0,
          width: 0,
        }]);

      expect((viewModel.positionMap as any)[1])
        .toMatchObject([{
          allDay: false,
          appointmentReduced: null,
          cellPosition: 100,
          count: 1,
          dateSettingIndex: 0,
          direction: 'vertical',
          groupIndex: 0,
          hMax: 0,
          height: -300,
          index: 0,
          info: {
            appointment: {
              startDate: new Date(2021, 8, 24, 11),
              endDate: new Date(2021, 8, 24, 12),
              normalizedEndDate: new Date(2021, 8, 24, 12),
              source: {
                startDate: new Date(2021, 8, 24, 11),
                endDate: new Date(2021, 8, 24, 12),
                exceptionDate: new Date(2021, 8, 24, 11),
              },
            },
            dateText: '11:00 AM - 12:00 PM',
            resourceColor: undefined,
            sourceAppointment: {
              startDate: new Date(2021, 8, 24, 11),
              endDate: new Date(2021, 8, 24, 12),
              exceptionDate: new Date(2021, 8, 24, 11),
            },
          },
          left: 100,
          leftVirtualCellCount: 0,
          leftVirtualWidth: 0,
          rowIndex: 22,
          columnIndex: 5,
          sortedIndex: 1,
          top: 300,
          topVirtualCellCount: 0,
          topVirtualHeight: 0,
          vMax: 0,
          width: 0,
        }, {
          appointmentReduced: 'tail',
          cellPosition: 100,
          columnIndex: 6,
          count: 2,
          dateSettingIndex: 0,
          direction: 'vertical',
          groupIndex: 0,
          hMax: 0,
          height: 700,
          index: 1,
          info: {
            appointment: {
              startDate: new Date(2021, 8, 24, 11),
              endDate: new Date(2021, 8, 24, 12),
              normalizedEndDate: new Date(2021, 8, 24, 12),
              source: {
                startDate: new Date(2021, 8, 24, 11),
                endDate: new Date(2021, 8, 24, 12),
                exceptionDate: new Date(2021, 8, 24, 11),
              },
            },
            dateText: '11:00 AM - 12:00 PM',
            sourceAppointment: {
              startDate: new Date(2021, 8, 24, 11),
              endDate: new Date(2021, 8, 24, 12),
              exceptionDate: new Date(2021, 8, 24, 11),
            },
          },
          isCompact: true,
          left: 200,
          leftVirtualCellCount: 0,
          leftVirtualWidth: 0,
          rowIndex: 0,
          sortedIndex: 3,
          top: 0,
          topVirtualCellCount: 0,
          topVirtualHeight: 0,
          vMax: 0,
          width: 0,
        }]);
    });
  });
});
