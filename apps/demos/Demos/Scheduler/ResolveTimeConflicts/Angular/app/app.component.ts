import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxSchedulerModule, DxSelectBoxModule } from 'devextreme-angular';
import { DxSchedulerTypes } from 'devextreme-angular/ui/scheduler';
import { custom as customDialog } from 'devextreme/ui/dialog';
import type dxScheduler from 'devextreme/ui/scheduler';
import { Appointment, Assignee, Service, assignees } from './app.service';

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
  ],
})
export class AppComponent {
  appointmentsData: Appointment[];

  currentDate: Date = new Date(2026, 1, 10);

  views: DxSchedulerTypes.ViewType[] = ['day', 'week', 'workWeek', 'month'];

  assignees: Assignee[] = assignees;

  resources = [{
    fieldExpr: 'assigneeId',
    dataSource: assignees,
    valueExpr: 'id',
    colorExpr: 'color',
    icon: 'user',
    allowMultiple: true,
  }];

  overlappingRuleItems = [
    { value: 'sameResource', text: 'Allow across resources' },
    { value: 'allResources', text: 'Disallow all overlaps' },
  ];

  private popup: any;
  private form: any;
  private showConflictError = false;
  private overlappingRule = 'sameResource';

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editingOptions = {
    popup: {
      onInitialized: (e: any) => { this.popup = e.component; },
      onHidden: () => {
        this.setConflictError(false);
        this.form?.updateData('assigneeId', []);
      },
    },
    form: {
      labelMode: 'hidden',
      elementAttr: { class: 'hide-informer' },
      onInitialized: (e: any) => {
        this.form = e.component;
        this.form.on('fieldDataChanged', (event: any) => {
          if (this.showConflictError && ['startDate', 'endDate', 'assigneeId', 'recurrenceRule'].includes(event.dataField)) {
            this.setConflictError(false);
            this.form.validate();
          }
        });
      },
      items: [
        {
          name: 'conflictInformer',
          template: (_data: unknown, element: any) => {
            const div = document.createElement('div');
            div.className = 'conflict-informer';
            div.textContent = 'This time slot conflicts with another appointment.';
            (element[0] ?? element).appendChild(div);
          },
        },
        {
          name: 'mainGroup',
          items: [
            'subjectGroup',
            'dateGroup',
            'repeatGroup',
            {
              name: 'assigneeIdGroup',
              items: [
                'assigneeIdIcon',
                {
                  name: 'assigneeId',
                  isRequired: true,
                  editorOptions: {
                    onValueChanged: (e: any) => {
                      if (e.value.length > 1) {
                        e.component.option('value', [e.value[e.value.length - 1]]);
                      }
                    },
                    tagTemplate: (tagData: Assignee) => {
                      const container = document.createElement('div');
                      container.className = 'dx-tag-content';
                      container.style.backgroundColor = tagData.color;
                      container.style.borderColor = tagData.color;
                      const span = document.createElement('span');
                      span.textContent = tagData.text;
                      const removeBtn = document.createElement('div');
                      removeBtn.className = 'dx-tag-remove-button';
                      container.appendChild(span);
                      container.appendChild(removeBtn);
                      return container;
                    },
                  },
                },
              ],
            },
          ],
        },
        'recurrenceGroup',
      ],
      customizeItem: (item: any) => {
        if (item.name === 'allDayEditor' || item.name === 'recurrenceEndEditor') {
          item.label.visible = true;
        } else if (item.name === 'subjectEditor') {
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
      },
    },
  };

  constructor(service: Service) {
    this.appointmentsData = service.getAppointments();
  }

  private setConflictError(show: boolean): void {
    this.showConflictError = show;
    this.form?.option('elementAttr.class', show ? '' : 'hide-informer');
  }

  private getNextDay(date: Date): Date {
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    return next;
  }

  private getEndDate(occurrence: DxSchedulerTypes.Occurrence): Date {
    return (occurrence.appointmentData as Appointment).allDay
      ? this.getNextDay(occurrence.startDate as Date)
      : occurrence.endDate as Date;
  }

  private isOverlapping(a: DxSchedulerTypes.Occurrence, b: DxSchedulerTypes.Occurrence): boolean {
    const aEnd = this.getEndDate(a);
    const bEnd = this.getEndDate(b);
    if ((a.startDate as Date) >= bEnd || (b.startDate as Date) >= aEnd) return false;
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
      .filter((occ) => (occ.appointmentData as Appointment).id !== newAppointment.id);

    const newOccurrences = scheduler.getOccurrences(startDate, endDate, [newAppointment]);

    return newOccurrences.some((newOcc) =>
      existingOccurrences.some((existingOcc) =>
        this.isOverlapping(newOcc, existingOcc),
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
        messageHtml: 'This time slot conflicts with another appointment.',
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
    this.alertConflictIfNeeded(e, { ...e.appointmentData, ...e.newData } as Appointment);
  }

  onOverlappingRuleChanged(e: any): void {
    this.overlappingRule = e.value;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
