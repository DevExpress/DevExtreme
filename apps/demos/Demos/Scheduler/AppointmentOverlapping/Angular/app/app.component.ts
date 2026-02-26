import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, ViewChild, provideZoneChangeDetection } from '@angular/core';
import { DxSchedulerModule, DxSchedulerComponent, DxSwitchModule } from 'devextreme-angular';
import { DxSchedulerTypes } from 'devextreme-angular/ui/scheduler';
import notify from 'devextreme/ui/notify';
import dxForm from 'devextreme/ui/form';
import { Appointment, Service, projects } from './app.service';

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
    DxSwitchModule,
  ],
})
export class AppComponent {
  @ViewChild(DxSchedulerComponent, { static: false }) scheduler!: DxSchedulerComponent;

  appointmentsData: Appointment[];

  currentDate: Date = new Date(2026, 1, 10);

  allowOverlapping = false;

  resources = [{
    fieldExpr: 'projectId',
    dataSource: projects,
    valueExpr: 'id',
    colorExpr: 'color',
  }];

  editingConfig = {
    form: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      customizeItem: (item: any) => {
        if (item.name === 'endDateEditor') {
          const alreadyAdded = (item.validationRules ?? []).some(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (r: any) => r.type === 'custom' && r.message === 'This time slot conflicts with another appointment.',
          );
          if (alreadyAdded) return;
          item.validationRules = [
            ...(item.validationRules ?? []),
            {
              type: 'custom',
              message: 'This time slot conflicts with another appointment.',
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              validationCallback: ({ validator }: any): boolean => {
                if (this.allowOverlapping) return true;
                const formEl = validator.$element().closest('.dx-form')[0];
                const formInstance = dxForm.getInstance(formEl);
                if (!formInstance) return true;
                const formData = formInstance.option('formData') as Appointment;
                const hasConflict = this.detectConflict(formData);
                const informerEl = formEl.querySelector('.conflict-informer') as HTMLElement | null;
                if (informerEl) {
                  informerEl.style.display = hasConflict ? '' : 'none';
                }
                return !hasConflict;
              },
            },
          ];
        }
      },
    },
  };

  constructor(service: Service) {
    this.appointmentsData = service.getAppointments();
  }

  private isOverlapping(
    a: { startDate: Date; endDate: Date },
    b: { startDate: Date; endDate: Date },
  ): boolean {
    return a.startDate < b.endDate && a.endDate > b.startDate;
  }

  detectConflict(newAppt: Appointment): boolean {
    const instance = this.scheduler?.instance;
    if (!instance) return false;

    const allItems = instance.getDataSource().items() as Appointment[];

    const existingOccurrences = instance
      .getOccurrences(new Date(newAppt.startDate), new Date(newAppt.endDate), allItems)
      .filter((occ) => (occ.appointmentData as Appointment).id !== newAppt.id);

    const expandEnd = new Date(newAppt.endDate);
    expandEnd.setDate(expandEnd.getDate() + 14);

    const newOccurrences = instance.getOccurrences(
      new Date(newAppt.startDate),
      expandEnd,
      [newAppt],
    );

    return newOccurrences.some((newOcc) =>
      existingOccurrences.some((existingOcc) => this.isOverlapping(newOcc, existingOcc)),
    );
  }

  onAppointmentFormOpening(e: DxSchedulerTypes.AppointmentFormOpeningEvent): void {
    const { form } = e;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = form.option('items') as any[];
    if (!items.some((item: any) => item.name === 'conflictInformer')) {
      form.option('items', [
        {
          name: 'conflictInformer',
          itemType: 'simple',
          label: { visible: false },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          template: (_: unknown, element: any) => {
            const div = document.createElement('div');
            div.className = 'conflict-informer';
            div.textContent = 'This time slot conflicts with another appointment.';
            div.style.display = 'none';
            (element[0] ?? element).appendChild(div);
          },
        },
        ...items,
      ]);
    }
  }

  onAppointmentAdding(e: DxSchedulerTypes.AppointmentAddingEvent): void {
    if (this.allowOverlapping) return;

    if (this.detectConflict(e.appointmentData as Appointment)) {
      e.cancel = true;
      notify('Cannot create an appointment that overlaps with an existing one.', 'warning', 2000);
    }
  }

  onAppointmentUpdating(e: DxSchedulerTypes.AppointmentUpdatingEvent): void {
    if (this.allowOverlapping) return;

    const updatedAppt = { ...e.appointmentData, ...e.newData } as Appointment;
    if (this.detectConflict(updatedAppt)) {
      e.cancel = true;
      notify('Cannot move an appointment to a time slot that is already occupied.', 'warning', 2000);
    }
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
