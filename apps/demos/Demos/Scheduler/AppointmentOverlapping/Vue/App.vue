<template>
  <div>
    <DxScheduler
      ref="schedulerRef"
      :data-source="dataSource"
      :current-date="currentDate"
      :views="views"
      :height="600"
      :start-day-hour="9"
      :end-day-hour="19"
      current-view="week"
      :resources="resources"
      :editing="editingConfig"
      :on-appointment-adding="onAppointmentAdding"
      :on-appointment-updating="onAppointmentUpdating"
      :on-appointment-form-opening="onAppointmentFormOpening"
    />
    <div class="options">
      <div class="caption">Options</div>
      <div class="option">
        <span>Allow Appointment Overlapping</span>
        <DxSwitch
          v-model:value="allowOverlapping"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DxScheduler, { type DxSchedulerTypes } from 'devextreme-vue/scheduler';
import DxSwitch from 'devextreme-vue/switch';
import notify from 'devextreme/ui/notify';
import dxForm from 'devextreme/ui/form';
import { data, projects, type Appointment } from './data.ts';

const views = ['day', 'week'];
const currentDate = new Date(2026, 1, 10);
const dataSource = data;
const allowOverlapping = ref(false);
const schedulerRef = ref<InstanceType<typeof DxScheduler> | null>(null);
const resources = [{
  fieldExpr: 'projectId',
  dataSource: projects,
  valueExpr: 'id',
  colorExpr: 'color',
}];

function isOverlapping(
  a: { startDate: Date; endDate: Date },
  b: { startDate: Date; endDate: Date },
): boolean {
  return a.startDate < b.endDate && a.endDate > b.startDate;
}

function detectConflict(newAppt: Appointment): boolean {
  const instance = schedulerRef.value?.instance;
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
    existingOccurrences.some((existingOcc) => isOverlapping(newOcc, existingOcc)),
  );
}

const editingConfig = {
  form: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    customizeItem(item: any): void {
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
            validationCallback({ validator }: any): boolean {
              if (allowOverlapping.value) return true;
              const formEl = validator.$element().closest('.dx-form')[0];
              const formInstance = dxForm.getInstance(formEl);
              if (!formInstance) return true;
              const formData = formInstance.option('formData') as Appointment;
              const hasConflict = detectConflict(formData);
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

function onAppointmentFormOpening(e: DxSchedulerTypes.AppointmentFormOpeningEvent): void {
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

function onAppointmentAdding(e: DxSchedulerTypes.AppointmentAddingEvent): void {
  if (allowOverlapping.value) return;

  if (detectConflict(e.appointmentData as Appointment)) {
    e.cancel = true;
    notify('Cannot create an appointment that overlaps with an existing one.', 'warning', 2000);
  }
}

function onAppointmentUpdating(e: DxSchedulerTypes.AppointmentUpdatingEvent): void {
  if (allowOverlapping.value) return;

  const updatedAppt = { ...e.appointmentData, ...e.newData } as Appointment;
  if (detectConflict(updatedAppt)) {
    e.cancel = true;
    notify('Cannot move an appointment to a time slot that is already occupied.', 'warning', 2000);
  }
}
</script>

<style scoped>
  :deep(.conflict-informer) {
    background-color: #fceae8;
    color: #c50f1f;
    padding: 8px 12px;
    border-radius: 4px;
  }

  .options {
    padding: 20px;
    background-color: rgba(191, 191, 191, 0.15);
    margin-top: 20px;
  }

  .caption {
    font-size: 18px;
    font-weight: 500;
  }

  .option {
    margin-top: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
</style>
