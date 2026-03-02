<template>
  <DxScheduler
    :data-source="data"
    :views="views"
    :current-view="'week'"
    :current-date="currentDate"
    :start-day-hour="9"
    :end-day-hour="19"
    :height="600"
    :show-all-day-panel="false"
    @appointment-adding="onAppointmentAdding"
    @appointment-updating="onAppointmentUpdating"
  >
    <DxResource
      field-expr="assigneeId"
      :data-source="assignees"
      value-expr="id"
      color-expr="color"
      icon="user"
      :allow-multiple="true"
    />

    <DxEditing
      :popup="popupOptions"
    >
      <DxForm
        label-mode="hidden"
        :customize-item="customizeItem"
        :element-attr="formElementAttr"
        @initialized="onFormInitialized"
      >
        <DxItem
          type="group"
          name="mainGroup"
        >
          <DxItem
            name="conflictInformer"
            template="conflict-informer-template"
          />
          <DxItem name="subjectGroup"/>
          <DxItem name="dateGroup"/>
          <DxItem name="repeatGroup"/>
          <DxItem name="assigneeIdGroup">
            <DxItem name="assigneeIdIcon"/>
            <DxItem
              name="assigneeId"
              :is-required="true"
              :editor-options="assigneeIdEditorOptions"
            />
          </DxItem>
        </DxItem>
        <DxItem
          type="group"
          name="recurrenceGroup"
        />
      </DxForm>
    </DxEditing>

    <template #conflict-informer-template>
      <div class="conflict-informer">This time slot conflicts with another appointment</div>
    </template>

    <template #tagTemplate="{ data: itemData }">
      <div
        class="dx-tag-content"
        :style="{ backgroundColor: itemData.color, borderColor: itemData.color }"
      >
        {{ itemData.text }}
        <div class="dx-tag-remove-button"/>
      </div>
    </template>
  </DxScheduler>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DxScheduler, {
  DxResource,
  DxEditing,
  DxForm,
  DxItem,
  type DxSchedulerTypes,
} from 'devextreme-vue/scheduler';
import { custom as customDialog } from 'devextreme/ui/dialog';
import type { DxFormTypes } from 'devextreme-vue/form';
import type { DxTagBoxTypes } from 'devextreme-vue/tag-box';
import type dxScheduler from 'devextreme/ui/scheduler';
import dxForm from 'devextreme/ui/form.js';
import dxPopup from 'devextreme/ui/popup.js';
import { data, assignees, type Appointment } from './data.ts';

let form: dxForm | undefined;
let popup: dxPopup | undefined;
let showConflictError = false;

const currentDate = new Date(2026, 1, 10);
const views: DxSchedulerTypes.ViewType[] = ['day', 'week'];

const formElementAttr = { class: 'hide-informer' };

function isOverlapping(a: DxSchedulerTypes.Occurrence, b: DxSchedulerTypes.Occurrence): boolean {
  return a.appointmentData.assigneeId[0] === b.appointmentData.assigneeId[0] &&
    a.startDate < b.endDate && a.endDate > b.startDate;
}

const detectConflict = (scheduler: dxScheduler, newAppointment: Appointment): boolean => {
  const allAppointments = scheduler.getDataSource().items() as Appointment[];
  const startDate = new Date(newAppointment.startDate);
  const endDate = newAppointment.recurrenceRule
    ? scheduler.getEndViewDate()
    : new Date(newAppointment.endDate);

  const existingOccurrences = scheduler
    .getOccurrences(startDate, endDate, allAppointments)
    .filter((occurrence) => occurrence.appointmentData.id !== newAppointment.id);

  const newOccurrences = scheduler.getOccurrences(
    startDate,
    endDate,
    [newAppointment],
  );

  return newOccurrences.some((newOccurrence) =>
    existingOccurrences.some((existingOccurrence) =>
      isOverlapping(newOccurrence, existingOccurrence),
    ),
  );
};

const assigneeIdEditorOptions = {
  onValueChanged: (e: DxTagBoxTypes.ValueChangedEvent) => {
    if (e.value.length > 1) {
      e.component.option('value', [e.value[e.value.length - 1]]);
    }
  },
  tagTemplate: 'tagTemplate',
};

const popupOptions = {
  onInitialized: (e: any) => {
    popup = e.component;
  },
};

const alertConflictIfNeeded = (
  e: DxSchedulerTypes.AppointmentAddingEvent | DxSchedulerTypes.AppointmentUpdatingEvent,
  appointmentData: Appointment,
) => {
  const hasConflict = detectConflict(e.component, appointmentData);

  if (!hasConflict) {
    showConflictError = false;
    return;
  }

  e.cancel = true;

  if (popup?.option('visible')) {
    showConflictError = true;
    form?.validate();
    form?.option('elementAttr.class', '');
  } else {
    const dialog = customDialog({
      showTitle: false,
      messageHtml: 'This time slot conflicts with another appointment.',
      buttons: [{
        type: 'default',
        text: 'cancel',
        stylingMode: 'contained',
        onClick: () => {
          dialog.hide();
        },
      }],
    });
    dialog.show();
  }
};

const onAppointmentAdding = (e: DxSchedulerTypes.AppointmentAddingEvent) => {
  alertConflictIfNeeded(e, e.appointmentData as Appointment);
};

const onAppointmentUpdating = (e: DxSchedulerTypes.AppointmentUpdatingEvent) => {
  alertConflictIfNeeded(e, e.newData);
};

const onFormInitialized = (e: DxFormTypes.InitializedEvent) => {
  form = e.component;

  e.component.on('fieldDataChanged', (fieldEvent: any) => {
    if (
      showConflictError &&
      ['startDate', 'endDate', 'assigneeId'].includes(fieldEvent.dataField)
    ) {
      showConflictError = false;
      form?.option('elementAttr.class', 'hide-informer');
      form?.validate();
    }
  });
};

const customizeItem = (item: DxFormTypes.SimpleItem) => {
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
        validationCallback: () => !showConflictError,
      },
    ];
  }
};

</script>

<style scoped>
.hide-informer .dx-scheduler-form-main-group .dx-item:has(.conflict-informer) {
  display: none !important;
}

.hide-informer .dx-scheduler-form-main-group .dx-scheduler-form-subject-group {
  padding-top: 0 !important;
}

.conflict-informer {
  background-color: #fceae8;
  color: #c50f1f;
  font-size: 13px;
  padding: 8px 12px;
}

.dx-dialog .dx-overlay-content {
  width: 280px;
}

.dx-dialog .dx-toolbar-center,
.dx-dialog .dx-button {
  width: 100%;
}
</style>
