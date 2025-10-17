import type { template } from '@js/common';
import type { Properties } from '@js/ui/scheduler';

export type RawViewType = Required<Properties>['views'][number];
export type ViewType = Extract<RawViewType, string>;
export type ViewObject = Extract<RawViewType, object>;
export type View = ViewObject & Required<Pick<ViewObject,
  'groupOrientation'
  | 'intervalCount'
  | 'type'
>>;
export type AgendaView = ViewObject & Required<Pick<ViewObject,
  'agendaDuration'
  | 'intervalCount'
  | 'type'
>>;
export type NormalizedView = View | AgendaView;

export interface SchedulerInternalOptions {
  indicatorTime?: Date;
  renovateRender: boolean;
  _draggingMode: 'outlook' | 'default';
  _appointmentTooltipOffset: { x: number; y: number };
  _appointmentCountPerCell: number;
  _collectorOffset: number;
  _appointmentOffset: number;
  appointmentPopupTemplate: template;
  disabledExpr: string;
  allowMultipleCellSelection: boolean;
}

export interface SchedulerOptionsRule {
  device: () => boolean;
  options: Properties & Partial<SchedulerInternalOptions>;
}

type RequiredOptions = 'views'
  | 'currentView'
  | 'currentDate'
  | 'groups'
  | 'resources'
  | 'appointmentTemplate'
  | 'dropDownAppointmentTemplate'
  | 'appointmentCollectorTemplate'
  | 'startDayHour'
  | 'endDayHour'
  | 'offset'
  | 'editing'
  | 'showAllDayPanel'
  | 'showCurrentTimeIndicator'
  | 'shadeUntilCurrentTime'
  | 'indicatorUpdateInterval'
  | 'recurrenceEditMode'
  | 'cellDuration'
  | 'maxAppointmentsPerCell'
  | 'selectedCellData'
  | 'groupByDate'
  | 'appointmentTooltipTemplate'
  | 'crossScrollingEnabled'
  | 'useDropDownViewSwitcher'
  | 'startDateExpr'
  | 'endDateExpr'
  | 'textExpr'
  | 'descriptionExpr'
  | 'allDayExpr'
  | 'recurrenceRuleExpr'
  | 'recurrenceExceptionExpr'
  | 'remoteFiltering'
  | 'timeZone'
  | 'startDateTimeZoneExpr'
  | 'endDateTimeZoneExpr'
  | 'noDataText'
  | 'adaptivityEnabled'
  | 'scrolling'
  | 'allDayPanelMode'
  | 'toolbar';
export type DateOption = 'currentDate' | 'min' | 'max';
export type SafeSchedulerOptions = SchedulerInternalOptions
  & Omit<Properties, RequiredOptions>
  & Pick<Required<Properties>, RequiredOptions>
  & {
    integrationOptions: object;
    currentDate: Date;
    min?: Date;
    max?: Date;
    scrolling: Required<Properties['scrolling']> & {
      orientation?: 'horizontal' | 'both' | 'vertical';
    };
    toolbar: Required<Properties['toolbar']>;
  };
