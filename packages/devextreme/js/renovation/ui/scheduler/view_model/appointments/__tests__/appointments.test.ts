import ViewDataProvider from '../../../../../../ui/scheduler/workspaces/view_model/view_data_provider';
import { SchedulerProps, ViewProps } from '../../../props';
import { DataAccessorType, ViewType } from '../../../types';
import { prepareGenerationOptions } from '../../../workspaces/base/work_space';
import { getViewRenderConfigByType } from '../../../workspaces/base/work_space_config';
import { WorkSpaceProps } from '../../../workspaces/props';
import { CellsMetaData, ViewDataProviderType } from '../../../workspaces/types';
import { getAppointmentsViewModel } from '../appointments';
import { getAppointmentsConfig, getAppointmentsModel } from '../../../model/appointments';
import { compileGetter, compileSetter } from '../../../../../../core/utils/data';
import { createTimeZoneCalculator } from '../../../timeZoneCalculator/createTimeZoneCalculator';
import { AppointmentsConfigType } from '../../../model/types';
import { TimeZoneCalculator } from '../../../timeZoneCalculator/utils';
import { getCurrentViewConfig } from '../../../model/views';

jest.mock('../../../../../../ui/scheduler/workspaces/helpers/positionHelper', () => ({
  ...jest.requireActual('../../../../../../ui/scheduler/workspaces/helpers/positionHelper'),
  PositionHelper: jest.fn(() => ({
    getHorizontalMax: (): number => 100,
    getResizableStep: (): number => 110,
    getVerticalMax: (): number => 120,
    getOffsetByAllDayPanel: (): number => 130,
    getGroupTop: (): number => 140,
  })),
}));

const defaultDataAccessors: DataAccessorType = {
  getter: {
    startDate: compileGetter('startDate') as any,
    endDate: compileGetter('endDate') as any,
    recurrenceRule: compileGetter('recurrenceRule') as any,
  },
  setter: {
    startDate: compileSetter('startDate') as any,
    endDate: compileSetter('endDate') as any,
    recurrenceRule: compileSetter('recurrenceRule') as any,
  },
  expr: {
    startDateExpr: 'startDate',
    endDateExpr: 'endDate',
    recurrenceRuleExpr: 'recurrenceRuleExpr',
  } as any,
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
  };

  // TODO: convert ViewdataProvider to TS
  const viewDataProvider = (new ViewDataProvider('week') as unknown) as ViewDataProviderType;
  const viewRenderConfig = getViewRenderConfigByType(
    workspaceProps.type,
    workspaceProps.crossScrollingEnabled,
    workspaceProps.intervalCount,
    workspaceProps.groups,
    workspaceProps.groupOrientation,
  );
  const generationOptions = prepareGenerationOptions(
    workspaceProps as any,
    viewRenderConfig,
    isAllDayPanelVisible,
    {
      startCellIndex: 0,
      startRowIndex: 0,
    },
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
      [{
        left: 0, top: 0, width: 100, height: 200,
      }],
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
        { // Cell #6
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
    describe('Regular Appointments', () => {
      it('should generate regular appointments correctly', () => {
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

        appointmentsModel.maxAppointmentsPerCell = 'unlimited';

        const expectedViewModel0 = {
          appointment: {
            startDate: new Date(2021, 8, 23, 10),
            endDate: new Date(2021, 8, 23, 11),
          },
          geometry: {
            height: -80,
            width: 100,
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
          regularCompact,
          allDayCompact,
        } = viewModel;

        expect(regular)
          .toHaveLength(2);

        expect(regularCompact)
          .toHaveLength(0);

        expect(allDay)
          .toHaveLength(0);

        expect(allDayCompact)
          .toHaveLength(0);

        expect(regular[0])
          .toMatchObject(expectedViewModel0);

        expect(regular[1])
          .toMatchObject({
            appointment: {
              startDate: new Date(2021, 8, 24, 11),
              endDate: new Date(2021, 8, 24, 12),
            },
            geometry: {
              height: -180,
              width: 100,
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
      });

      it('should generate compact regular appoitments correctly', () => {
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

        appointmentsModel.maxAppointmentsPerCell = 0;

        const viewModel = getAppointmentsViewModel(
          appointmentsModel,
          [{
            startDate: new Date(2021, 8, 24, 11),
            endDate: new Date(2021, 8, 24, 12),
          }],
        );

        const {
          regular,
          allDay,
          regularCompact,
          allDayCompact,
        } = viewModel;

        expect(regular)
          .toHaveLength(0);

        expect(regularCompact)
          .toHaveLength(1);

        expect(allDay)
          .toHaveLength(0);

        expect(allDayCompact)
          .toHaveLength(0);

        expect(regularCompact[0])
          .toMatchObject({
            key: '0-22-5-false',
            geometry: {
              left: 171,
              top: 300,
            },
            isAllDay: false,
            items: {
              colors: [undefined],
              data: [{
                startDate: new Date(2021, 8, 24, 11),
                endDate: new Date(2021, 8, 24, 12),
              }],
              settings: [{
                appointment: {
                  startDate: new Date(2021, 8, 24, 11),
                  endDate: new Date(2021, 8, 24, 12),
                },
                geometry: {
                  height: -180,
                  width: 74,
                  left: 100,
                  top: 300,
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
              }],
            },
          });
      });
    });

    describe('All Day Appointments', () => {
      it('should generate all day appointments correctly', () => {
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
            key: '200-0--100-24.5',

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
              width: -100,
            },
            info: {
              allDay: true,
              direction: 'horizontal',
              groupIndex: 0,
              isRecurrent: false,
              appointment: {
                allDay: false,
                startDate: new Date(2021, 8, 23),
                endDate: new Date(2021, 8, 24),
                normalizedEndDate: new Date(2021, 8, 24),
                source: {
                  startDate: new Date(2021, 8, 23),
                  endDate: new Date(2021, 8, 24),
                  exceptionDate: new Date(2021, 8, 23),
                },
              },
              appointmentReduced: 'head',
              dateText: '12:00 AM - 12:00 AM',
              sourceAppointment: {
                startDate: new Date(2021, 8, 23),
                endDate: new Date(2021, 8, 24),
                exceptionDate: new Date(2021, 8, 23),
              },
            },
          });
      });

      it('should generate all day appointment in date view correctly', () => {
        const appointment = {
          text: 'Test-01',
          startDate: new Date(2021, 3, 29),
          endDate: new Date(2021, 3, 29, 1),
          allDay: true,
        };
        const instances = prepareInstances(
          'month',
          new Date(2021, 3, 29),
          1,
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

        const viewModel = getAppointmentsViewModel(
          appointmentsModel,
          [appointment],
        );

        const {
          regular,
          allDay,
          regularCompact,
          allDayCompact,
        } = viewModel;

        expect(regular)
          .toHaveLength(1);

        expect(regularCompact)
          .toHaveLength(0);

        expect(allDay)
          .toHaveLength(0);

        expect(allDayCompact)
          .toHaveLength(0);

        expect(regular[0].appointment)
          .toMatchObject(appointment);
      });

      it('should generate all day appointment in date view if vertical grouping', () => {
        const appointment = {
          text: 'Test-01',
          startDate: new Date(2021, 3, 29),
          endDate: new Date(2021, 3, 29, 1),
          allDay: true,
        };
        const instances = prepareInstances(
          'week',
          new Date(2021, 3, 29),
          1,
          true,
          true,
        );

        instances.appointmentsConfig.isVerticalGroupOrientation = true;

        const appointmentsModel = getAppointmentsModel(
          instances.appointmentsConfig,
          instances.viewDataProvider,
          instances.timeZoneCalculator,
          defaultDataAccessors,
          instances.DOMMetaData,
        );

        const viewModel = getAppointmentsViewModel(
          appointmentsModel,
          [appointment],
        );

        const {
          regular,
          allDay,
          regularCompact,
          allDayCompact,
        } = viewModel;

        expect(regular)
          .toHaveLength(1);

        expect(regularCompact)
          .toHaveLength(0);

        expect(allDay)
          .toHaveLength(0);

        expect(allDayCompact)
          .toHaveLength(0);

        expect(regular[0].appointment)
          .toMatchObject(appointment);
      });
    });

    describe('Recurrent', () => {
      it('should generate recurrent appoitments correctly', () => {
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

        const viewModel = getAppointmentsViewModel(
          appointmentsModel,
          [{
            startDate: new Date(2021, 8, 24, 11),
            endDate: new Date(2021, 8, 24, 12),
            recurrenceRule: 'FREQ=DAILY;COUNT=3',
          }],
        );

        const {
          regular,
          allDay,
          regularCompact,
          allDayCompact,
        } = viewModel;

        expect(regular)
          .toHaveLength(2);

        expect(regularCompact)
          .toHaveLength(1);

        expect(allDay)
          .toHaveLength(0);

        expect(allDayCompact)
          .toHaveLength(0);
      });
    });
  });
});
