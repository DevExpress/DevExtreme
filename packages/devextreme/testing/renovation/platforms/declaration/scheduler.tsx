/* eslint-disable no-restricted-globals */
import {
  Component, ComponentBindings, JSXComponent, InternalState, Effect,
} from '@devextreme-generator/declarations';
import React from 'react';
import { AppointmentTemplateProps } from '../../../../js/renovation/ui/scheduler/appointment/types';
import { SchedulerProps } from '../../../../js/renovation/ui/scheduler/props';
import { Scheduler } from '../../../../js/renovation/ui/scheduler/scheduler';

const defaultAppointmentTemplate = ({
  data: {
    appointmentData: {
      startDate,
      endDate,
    },
  },
}: AppointmentTemplateProps): JSX.Element => {
  const styles: CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
  };

  const startDateValue = new Date(startDate).toISOString().substring(0, 16);
  const endDateValue = new Date(endDate).toISOString().substring(0, 16);

  return (
    <div style={styles}>
      <input type="datetime-local" value={startDateValue} />
      <input type="datetime-local" value={endDateValue} />
    </div>
  );
};

export const viewFunction = ({
  componentProps,
  appointmentTemplate,
}: App): JSX.Element => (
  <Scheduler
    id="container"
    adaptivityEnabled={componentProps.adaptivityEnabled}
    appointmentDragging={componentProps.appointmentDragging}
    crossScrollingEnabled={componentProps.crossScrollingEnabled}
    currentDate={componentProps.currentDate}
    currentView={componentProps.currentView}
    dataSource={componentProps.dataSource}
    dateSerializationFormat={componentProps.dateSerializationFormat}
    descriptionExpr={componentProps.descriptionExpr}
    editing={componentProps.editing}
    focusStateEnabled={componentProps.focusStateEnabled}
    groupByDate={componentProps.groupByDate}
    indicatorUpdateInterval={componentProps.indicatorUpdateInterval}
    max={componentProps.max}
    min={componentProps.min}
    noDataText={componentProps.noDataText}
    recurrenceEditMode={componentProps.recurrenceEditMode}
    remoteFiltering={componentProps.remoteFiltering}
    resources={componentProps.resources}
    scrolling={componentProps.scrolling}
    selectedCellData={componentProps.selectedCellData}
    shadeUntilCurrentTime={componentProps.shadeUntilCurrentTime}
    showAllDayPanel={componentProps.showAllDayPanel}
    showCurrentTimeIndicator={componentProps.showCurrentTimeIndicator}
    timeZone={componentProps.timeZone}
    useDropDownViewSwitcher={componentProps.useDropDownViewSwitcher}
    views={componentProps.views}
    endDayHour={componentProps.endDayHour}
    startDayHour={componentProps.startDayHour}
    firstDayOfWeek={componentProps.firstDayOfWeek}
    cellDuration={componentProps.cellDuration}
    groups={componentProps.groups}
    maxAppointmentsPerCell={componentProps.maxAppointmentsPerCell}
    customizeDateNavigatorText={componentProps.customizeDateNavigatorText}
    onAppointmentAdded={componentProps.onAppointmentAdded}
    onAppointmentAdding={componentProps.onAppointmentAdding}
    onAppointmentClick={componentProps.onAppointmentClick}
    onAppointmentContextMenu={componentProps.onAppointmentContextMenu}
    onAppointmentDblClick={componentProps.onAppointmentDblClick}
    onAppointmentDeleted={componentProps.onAppointmentDeleted}
    onAppointmentDeleting={componentProps.onAppointmentDeleting}
    onAppointmentFormOpening={componentProps.onAppointmentFormOpening}
    onAppointmentRendered={componentProps.onAppointmentRendered}
    onAppointmentUpdated={componentProps.onAppointmentUpdated}
    onAppointmentUpdating={componentProps.onAppointmentUpdating}
    onCellClick={componentProps.onCellClick}
    onCellContextMenu={componentProps.onCellContextMenu}
    recurrenceExceptionExpr={componentProps.recurrenceExceptionExpr}
    recurrenceRuleExpr={componentProps.recurrenceRuleExpr}
    startDateExpr={componentProps.startDateExpr}
    startDateTimeZoneExpr={componentProps.startDateTimeZoneExpr}
    endDateExpr={componentProps.endDateExpr}
    endDateTimeZoneExpr={componentProps.endDateTimeZoneExpr}
    allDayExpr={componentProps.allDayExpr}
    textExpr={componentProps.textExpr}
    dataCellTemplate={componentProps.dataCellTemplate}
    dateCellTemplate={componentProps.dateCellTemplate}
    timeCellTemplate={componentProps.timeCellTemplate}
    resourceCellTemplate={componentProps.resourceCellTemplate}
    appointmentCollectorTemplate={componentProps.appointmentCollectorTemplate}
    appointmentTemplate={appointmentTemplate}
    appointmentTooltipTemplate={componentProps.appointmentTooltipTemplate}
    toolbar={componentProps.toolbar}
    currentDateChange={componentProps.currentDateChange}
    currentViewChange={componentProps.currentViewChange}
    className={componentProps.className}
    activeStateEnabled={componentProps.activeStateEnabled}
    disabled={componentProps.disabled}
    height={componentProps.height}
    hint={componentProps.hint}
    hoverStateEnabled={componentProps.hoverStateEnabled}
    onClick={componentProps.onClick}
    onKeyDown={componentProps.onKeyDown}
    rtlEnabled={componentProps.rtlEnabled}
    tabIndex={componentProps.tabIndex}
    visible={componentProps.visible}
    width={componentProps.width}
  />
);

@ComponentBindings()
class AppProps { }

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: { register: true },
})
export class App extends JSXComponent<AppProps>() {
  @InternalState() options = {};

  @InternalState() currentDate = new Date();

  @InternalState() currentView: string;

  currentDateChange(date: Date): void {
    this.currentDate = date;
  }

  currentViewChange(view: string): void {
    this.currentView = view;
  }

  @Effect({ run: 'once' })
  optionsUpdated(): void {
    (window as unknown as { onOptionsUpdated: (unknown) => void })
      .onOptionsUpdated = (newOptions) => {
        const {
          currentDate,
          currentView,
          ...restProps
        } = newOptions;

        if (currentDate) {
          this.currentDate = currentDate;
        }

        if (currentView) {
          this.currentView = currentView;
        }

        this.options = {
          ...this.options,
          ...restProps,
        };
      };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get componentProps(): Partial<
  SchedulerProps &
  { currentDateChange: (date: Date) => void } &
  { currentViewChange: (view: string) => void }> {
    return {
      ...this.options,
      currentDate: this.currentDate,
      currentView: this.currentView,
      currentDateChange: (date: Date): void => this.currentDateChange(date),
      currentViewChange: (view: string): void => this.currentViewChange(view),
    };
  }

  get appointmentTemplate() {
    const { appointmentTemplate } = this.componentProps;
    return (appointmentTemplate as never) === 'ModularTemplate'
      ? defaultAppointmentTemplate
      : appointmentTemplate;
  }
}
