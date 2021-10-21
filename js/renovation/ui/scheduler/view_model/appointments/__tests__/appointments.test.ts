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
  isAllDayPanelVisible: boolean,
  supportAllDayRow: boolean,
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
    isAllDayPanelVisible,
  );
  viewDataProvider.update(generationOptions, true);

  const allDayPanelCellsMeta = isAllDayPanelVisible
    ? new Array(intervalCount).fill('').map((_, index) => ({
      left: index * 50,
      top: 0,
      width: 100,
      height: 200,
    }))
    : [];

  const DOMMetaData = {
    allDayPanelCellsMeta,
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
    supportAllDayRow,
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
  describe('getAppointmentsViewModel', () => {
    it('should generate regular appoitments correctly', () => {
      const instances = prepareInstances(
        'week',
        new Date(2021, 8, 22),
        7,
        false,
        false,
      );

      const appointmentsModel = getAppointmentsModel(
        instances.appointmentsConfig,
        instances.viewDataProvider,
        instances.timeZoneCalculator,
        defaultDataAccessors,
        instances.DOMMetaData,
      );

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

      const {
        regular,
        allDay,
      } = viewModel;

      expect(regular)
        .toHaveLength(4);

      expect(allDay)
        .toHaveLength(0);

      expect(regular[0])
        .toMatchObject(expectedViewModel0);

      expect(regular[1])
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

      expect(regular[2])
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

      expect(regular[3])
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

    it('should generate all day appoitments correctly', () => {
      const instances = prepareInstances(
        'week',
        new Date(2021, 8, 22),
        7,
        true,
        true,
      );

      const appointmentsModel = getAppointmentsModel(
        instances.appointmentsConfig,
        instances.viewDataProvider,
        instances.timeZoneCalculator,
        defaultDataAccessors,
        instances.DOMMetaData,
      );

      const viewModel = getAppointmentsViewModel(
        {
          ...appointmentsModel,
          showAllDayPanel: true,
          supportAllDayRow: true,
          allDayHeight: 75,
        },
        [{
          startDate: new Date(2021, 8, 23),
          endDate: new Date(2021, 8, 24),
        }],
      );

      const { allDay } = viewModel;

      expect(allDay)
        .toHaveLength(1);

      expect(allDay[0])
        .toEqual({
          appointment:
          {
            startDate: new Date(2021, 8, 23),
            endDate: new Date(2021, 8, 24),
          },
          geometry: {
            empty: true,
            height: 24.5,
            left: 200,
            leftVirtualWidth: 0,
            top: 0,
            topVirtualHeight: 0,
            width: -200,
          },
          info: {
            allDay: true,
            appointment: {
              startDate: new Date(2021, 8, 23),
              endDate: new Date(2021, 8, 24),
              normalizedEndDate: new Date(2021, 8, 24),
              source: {
                startDate: new Date(2021, 8, 23),
                endDate: new Date(2021, 8, 24),
                exceptionDate: new Date(2021, 8, 23),
              },
            },
            dateText: '12:00 AM - 12:00 AM',
            resourceColor: undefined,
            sourceAppointment: {
              startDate: new Date(2021, 8, 23),
              endDate: new Date(2021, 8, 24),
              exceptionDate: new Date(2021, 8, 23),
            },
          },
        });
    });
  });
});
