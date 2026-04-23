import devices from '@js/core/devices';
import $ from '@js/core/renderer';
import dateUtils from '@js/core/utils/date';
import type { Properties } from '@js/ui/scheduler';
import { isMaterial, isMaterialBased } from '@js/ui/themes';
import type { SafeAppointment } from '@ts/scheduler/types';

import type { SchedulerInternalOptions, SchedulerOptionsRule } from './types';

const DEFAULT_APPOINTMENT_TEMPLATE_NAME = 'item';
const DEFAULT_APPOINTMENT_COLLECTOR_TEMPLATE_NAME = 'appointmentCollector';

export const DEFAULT_ICONS_SHOW_MODE = 'main';

export const DEFAULT_SCHEDULER_OPTIONS: Properties = {
  views: ['day', 'week'],
  currentView: 'day', // TODO: should we calculate currentView if views array contains only one item, for example 'month'?
  currentDate: dateUtils.trimTime(new Date()),
  min: undefined,
  max: undefined,
  dateSerializationFormat: undefined,
  firstDayOfWeek: undefined,
  groups: [],
  resources: [],
  dataSource: null,
  customizeDateNavigatorText: undefined,
  appointmentTemplate: DEFAULT_APPOINTMENT_TEMPLATE_NAME,
  appointmentCollectorTemplate: DEFAULT_APPOINTMENT_COLLECTOR_TEMPLATE_NAME,
  dataCellTemplate: undefined,
  timeCellTemplate: undefined,
  resourceCellTemplate: undefined,
  dateCellTemplate: undefined,
  startDayHour: 0,
  endDayHour: 24,
  offset: 0,
  editing: {
    allowAdding: true,
    allowDeleting: true,
    allowDragging: true,
    allowResizing: true,
    allowUpdating: true,
    allowTimeZoneEditing: false,
    form: {
      iconsShowMode: DEFAULT_ICONS_SHOW_MODE,
    },
    popup: {},
  },
  showAllDayPanel: true,
  showCurrentTimeIndicator: true,
  shadeUntilCurrentTime: false,
  indicatorUpdateInterval: 300000,
  recurrenceEditMode: 'dialog',
  cellDuration: 30,
  maxAppointmentsPerCell: 'auto',
  selectedCellData: [],
  groupByDate: false,
  hiddenWeekDays: undefined,
  onAppointmentRendered: undefined,
  onAppointmentClick: undefined,
  onAppointmentDblClick: undefined,
  onAppointmentContextMenu: undefined,
  onCellClick: undefined,
  onCellContextMenu: undefined,
  onAppointmentAdding: undefined,
  onAppointmentAdded: undefined,
  onAppointmentUpdating: undefined,
  onAppointmentUpdated: undefined,
  onAppointmentDeleting: undefined,
  onAppointmentDeleted: undefined,
  onAppointmentFormOpening: undefined,
  onAppointmentTooltipShowing: undefined,
  appointmentTooltipTemplate: 'appointmentTooltip',
  crossScrollingEnabled: false,
  useDropDownViewSwitcher: false,
  startDateExpr: 'startDate',
  endDateExpr: 'endDate',
  textExpr: 'text',
  descriptionExpr: 'description',
  allDayExpr: 'allDay',
  recurrenceRuleExpr: 'recurrenceRule',
  recurrenceExceptionExpr: 'recurrenceException',
  remoteFiltering: false,
  timeZone: '',
  startDateTimeZoneExpr: 'startDateTimeZone',
  endDateTimeZoneExpr: 'endDateTimeZone',
  noDataText: '',
  adaptivityEnabled: false,
  scrolling: {
    mode: 'standard',
  },
  allDayPanelMode: 'all',
  snapToCellsMode: undefined,
  toolbar: {
    disabled: false,
    multiline: false,
    items: [
      { location: 'before', name: 'dateNavigator' },
      { location: 'after', name: 'viewSwitcher', locateInMenu: 'auto' },
    ],
  },
};

export const DEFAULT_SCHEDULER_INTERNAL_OPTIONS: SchedulerInternalOptions = {
  indicatorTime: undefined,
  editing: {
    // @ts-expect-error copy from default so that you can rewrite it
    ...DEFAULT_SCHEDULER_OPTIONS.editing,
    popup: {},
  },
  // TODO: legacy option property name
  _draggingMode: 'outlook',
  // TODO: legacy option property name
  _appointmentTooltipOffset: { x: 0, y: 0 },
  appointmentPopupTemplate: 'appointmentPopup',
  disabledExpr: 'disabled',
  visibleExpr: 'visible',
  allowMultipleCellSelection: true,
};

export const DEFAULT_SCHEDULER_INTEGRATION_OPTIONS = {
  integrationOptions: {
    useDeferUpdateForTemplates: false,
  },
};

export const DEFAULT_SCHEDULER_OPTIONS_RULES: SchedulerOptionsRule[] = [
  {
    device(): boolean {
      return devices.real().deviceType === 'desktop' && !devices.isSimulator();
    },
    options: {
      focusStateEnabled: true,
    },
  },
  {
    device(): boolean {
      return !devices.current().generic;
    },
    options: {
      useDropDownViewSwitcher: true,

      editing: {
        allowDragging: false,
        allowResizing: false,
      },
    },
  },
  {
    device(): boolean {
      // @ts-expect-error
      return isMaterialBased();
    },
    options: {
      useDropDownViewSwitcher: true,
      dateCellTemplate: (data: SafeAppointment, _: number, element: Element): void => {
        const { text = '' } = data;

        text.split(' ').forEach((word, wordIndex) => {
          const span = $('<span>')
            .text(word)
            .addClass('dx-scheduler-header-panel-cell-date');

          $(element).append(span);
          if (!wordIndex) $(element).append(' ' as unknown as Element);
        });
      },
    },
  },
  {
    device(): boolean {
      // @ts-expect-error
      return isMaterial();
    },
    options: {
      _appointmentTooltipOffset: { x: 0, y: 11 },
    },
  },
];
