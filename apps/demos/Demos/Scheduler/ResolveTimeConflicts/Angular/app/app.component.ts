import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxSchedulerModule, DxSelectBoxModule, DxTemplateModule } from 'devextreme-angular';
import { DxSchedulerTypes } from 'devextreme-angular/ui/scheduler';
import { DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import { DxFormTypes } from 'devextreme-angular/ui/form';
import { DxPopupTypes } from 'devextreme-angular/ui/popup';
import { DxTagBoxTypes } from 'devextreme-angular/ui/tag-box';
import { custom as customDialog } from 'devextreme/ui/dialog';
import { Appointment, Assignee, Service, assignees } from './app.service';

type dxScheduler = NonNullable<DxSchedulerTypes.InitializedEvent['component']>;
type dxForm = NonNullable<DxFormTypes.InitializedEvent['component']>;
type dxPopup = NonNullable<DxPopupTypes.InitializedEvent['component']>;

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    DxSchedulerModule,
    DxSelectBoxModule,
    DxTemplateModule,
  ],
})
export class AppComponent {
  appointmentsData: Appointment[];

  currentDate: Date = new Date(2026, 1, 10);

  views: DxSchedulerTypes.ViewType[] = ['day', 'week', 'workWeek', 'month'];

  assignees: Assignee[] = assignees;

  overlappingRuleItems = [
    { value: 'sameResource', text: 'Allow across resources' },
    { value: 'allResources', text: 'Disallow all overlaps' },
  ];

  assigneeIdEditorOptions = {
    onValueChanged: (e: DxTagBoxTypes.ValueChangedEvent) => {
      if (e.value?.length > 1) {
        e.component.option('value', [e.value[e.value.length - 1]]);
      }
    },
    tagTemplate: 'assigneeTagTemplate',
  };

  popupOptions = {
    onInitialized: (e: DxPopupTypes.InitializedEvent) => { this.popup = e.component; },
    onHidden: () => {
      this.setConflictError(false);
      this.form?.updateData('assigneeId', []);
    },
  };

  formElementAttr = { id: 'form', class: 'hide-informer' };

  private popup?: dxPopup;

  private form?: dxForm;

  private overlappingRule = 'sameResource';

  constructor(service: Service) {
    this.appointmentsData = service.getAppointments();
  }

  private showConflictError = false;

  setConflictError(show: boolean): void {
    this.showConflictError = show;
    this.form?.option('elementAttr.class', show ? '' : 'hide-informer');
  }

  onFormInitialized = (e: DxFormTypes.InitializedEvent): void => {
    this.form = e.component;
    this.form?.on('fieldDataChanged', (event: { dataField: string }) => {
      if (this.showConflictError && ['startDate', 'endDate', 'assigneeId', 'recurrenceRule'].includes(event.dataField)) {
        this.setConflictError(false);
        this.form?.validate();
      }
    });
  };

  customizeItem = (item: DxFormTypes.SimpleItem): void => {
    if (item.name === 'allDayEditor' || item.name === 'recurrenceEndEditor') {
      item.label.visible = true;
    } else if (item.name === 'subjectEditor') {
      item.editorOptions = item.editorOptions || {};
      item.editorOptions.placeholder = 'Add title';
    }

    if (item.name === 'startTimeEditor' || item.name === 'endTimeEditor') {
      item.validationRules = [
        { type: 'required' },
        {
          type: 'custom',
          message: 'Time conflict',
          ignoreEmptyValue: true,
          reevaluate: true,
          validationCallback: () => !this.showConflictError,
        },
      ];
    }
  };

  private getNextDay(date: Date): Date {
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    return next;
  }

  private getEndDate(occurrence: DxSchedulerTypes.Occurrence): Date {
    return (occurrence.appointmentData as Appointment).allDay
      ? this.getNextDay(occurrence.startDate)
      : occurrence.endDate;
  }

  private isOverlapping(a: DxSchedulerTypes.Occurrence, b: DxSchedulerTypes.Occurrence): boolean {
    const aEnd = this.getEndDate(a);
    const bEnd = this.getEndDate(b);
    if (a.startDate >= bEnd || b.startDate >= aEnd) return false;
    if (this.overlappingRule === 'sameResource') {
      return (a.appointmentData as Appointment).assigneeId[0] === (b.appointmentData as Appointment).assigneeId[0];
    }
    return true;
  }

  private detectConflict(scheduler: dxScheduler, newAppointment: Appointment): boolean {
    const allAppointments = scheduler.getDataSource().items() as Appointment[];
    const startDate = new Date(newAppointment.startDate);
    let endDate: Date;
    if (newAppointment.recurrenceRule) {
      endDate = scheduler.getEndViewDate();
    } else if (newAppointment.allDay) {
      endDate = this.getNextDay(startDate);
    } else {
      endDate = new Date(newAppointment.endDate);
    }

    const existingOccurrences = scheduler
      .getOccurrences(startDate, endDate, allAppointments)
      .filter((occurrence) => (occurrence.appointmentData as Appointment).id !== newAppointment.id);

    const newOccurrences = scheduler.getOccurrences(startDate, endDate, [newAppointment]);

    return newOccurrences.some((newOccurrence) =>
      existingOccurrences.some((existingOccurrence) =>
        this.isOverlapping(newOccurrence, existingOccurrence),
      ),
    );
  }

  private alertConflictIfNeeded(
    e: DxSchedulerTypes.AppointmentAddingEvent | DxSchedulerTypes.AppointmentUpdatingEvent,
    appointmentData: Appointment,
  ): void {
    if (!this.detectConflict(e.component, appointmentData)) {
      this.setConflictError(false);
      return;
    }

    e.cancel = true;

    if (this.popup?.option('visible')) {
      this.setConflictError(true);
      this.form?.validate();
    } else {
      const dialog = customDialog({
        showTitle: false,
        messageHtml: '<p id="conflict-dialog">This time slot conflicts with another appointment.</p>',
        buttons: [{
          type: 'default',
          text: 'Close',
          stylingMode: 'contained',
          onClick: () => {
            dialog.hide();
          },
        }],
      });
      dialog.show();
    }
  }

  onAppointmentAdding(e: DxSchedulerTypes.AppointmentAddingEvent): void {
    this.alertConflictIfNeeded(e, e.appointmentData as Appointment);
  }

  onAppointmentUpdating(e: DxSchedulerTypes.AppointmentUpdatingEvent): void {
    this.alertConflictIfNeeded(e, { ...e.oldData, ...e.newData } as Appointment);
  }

  onOverlappingRuleChanged(e: DxSelectBoxTypes.ValueChangedEvent): void {
    this.overlappingRule = e.value;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
