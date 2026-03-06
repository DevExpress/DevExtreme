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
    all-day-panel-mode="hidden"
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

    <DxEditing :popup="popupOptions">
      <DxForm
        label-mode="hidden"
        :customize-item="customizeItem"
        :element-attr="formElementAttr"
        @initialized="onFormInitialized"
      >
        <DxItem
          name="conflictInformer"
          template="conflict-informer-template"
        />
        <DxItem
          type="group"
          name="mainGroup"
        >
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
      <div class="conflict-informer">This time slot conflicts with another appointment.</div>
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

  <div class="options">
    <div class="option">
      <span>Overlapping Rule</span>
      <DxSelectBox
        :items="overlappingRuleItems"
        value-expr="value"
        display-expr="text"
        value="sameResource"
        :width="200"
        @value-changed="onOverlappingRuleChanged"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import DxScheduler, {
  DxResource,
  DxEditing,
  DxForm,
  DxItem,
  type DxSchedulerTypes,
} from 'devextreme-vue/scheduler';
import DxSelectBox, { type DxSelectBoxTypes } from 'devextreme-vue/select-box';
import { custom as customDialog } from 'devextreme/ui/dialog';
import type { DxFormTypes } from 'devextreme-vue/form';
import type { DxTagBoxTypes } from 'devextreme-vue/tag-box';
import type { DxPopupTypes } from 'devextreme-vue/popup';
import type dxScheduler from 'devextreme/ui/scheduler';
import dxForm from 'devextreme/ui/form.js';
import dxPopup from 'devextreme/ui/popup.js';
import { data, assignees, type Appointment } from './data.ts';

let form: dxForm | undefined;
let popup: dxPopup | undefined;
let showConflictError = false;
let overlappingRule = 'sameResource';

const currentDate = new Date(2026, 1, 10);
const views: DxSchedulerTypes.ViewType[] = ['day', 'week', 'workWeek', 'month'];

const formElementAttr = { class: 'hide-informer' };

const overlappingRuleItems = [
  { value: 'sameResource', text: 'Allow across resources' },
  { value: 'allResources', text: 'Disallow all overlaps' },
];

function getNextDay(date: Date): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + 1);
  return next;
}

function getEndDate(occurrence: DxSchedulerTypes.Occurrence): Date {
  return (occurrence.appointmentData as Appointment).allDay
    ? getNextDay(occurrence.startDate)
    : occurrence.endDate;
}

function isOverlapping(a: DxSchedulerTypes.Occurrence, b: DxSchedulerTypes.Occurrence): boolean {
  const aEnd = getEndDate(a);
  const bEnd = getEndDate(b);
  if (a.startDate >= bEnd || b.startDate >= aEnd) return false;
  if (overlappingRule === 'sameResource') {
    return (a.appointmentData as Appointment).assigneeId[0] ===
    (b.appointmentData as Appointment).assigneeId[0];
  }
  return true;
}

function detectConflict(scheduler: dxScheduler, newAppointment: Appointment): boolean {
  const allAppointments = scheduler.getDataSource().items() as Appointment[];
  const startDate = new Date(newAppointment.startDate);
  let endDate: Date;
  if (newAppointment.recurrenceRule) {
    endDate = scheduler.getEndViewDate();
  } else if (newAppointment.allDay) {
    endDate = getNextDay(startDate);
  } else {
    endDate = new Date(newAppointment.endDate);
  }

  const existingOccurrences = scheduler
    .getOccurrences(startDate, endDate, allAppointments)
    .filter((occurrence) => (occurrence.appointmentData as Appointment).id !== newAppointment.id);

  const newOccurrences = scheduler.getOccurrences(startDate, endDate, [newAppointment]);

  return newOccurrences.some((newOccurrence) =>
    existingOccurrences.some((existingOccurrence) =>
      isOverlapping(newOccurrence, existingOccurrence),
    ),
  );
}

const assigneeIdEditorOptions = {
  onValueChanged: (e: DxTagBoxTypes.ValueChangedEvent) => {
    if (e.value.length > 1) {
      e.component.option('value', [e.value[e.value.length - 1]]);
    }
  },
  tagTemplate: 'tagTemplate',
};

function setConflictError(show: boolean) {
  showConflictError = show;
  form?.option('elementAttr.class', show ? '' : 'hide-informer');
}

const popupOptions = {
  onInitialized: (e: DxPopupTypes.InitializedEvent) => {
    popup = e.component as dxPopup;
  },
  onHidden: () => {
    setConflictError(false);
    form?.updateData('assigneeId', []);
  },
};

const alertConflictIfNeeded = (
  e: DxSchedulerTypes.AppointmentAddingEvent | DxSchedulerTypes.AppointmentUpdatingEvent,
  appointmentData: Appointment,
) => {
  if (!detectConflict(e.component, appointmentData)) {
    setConflictError(false);
    return;
  }

  e.cancel = true;

  if (popup?.option('visible')) {
    setConflictError(true);
    form?.validate();
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
};

const onAppointmentAdding = (e: DxSchedulerTypes.AppointmentAddingEvent) => {
  alertConflictIfNeeded(e, e.appointmentData as Appointment);
};

const onAppointmentUpdating = (e: DxSchedulerTypes.AppointmentUpdatingEvent) => {
  alertConflictIfNeeded(e, { ...e.oldData, ...e.newData } as Appointment);
};

const onFormInitialized = (e: DxFormTypes.InitializedEvent) => {
  form = e.component;

  e.component!.on('fieldDataChanged', (fieldEvent: { dataField: string }) => {
    if (
      showConflictError &&
      ['startDate', 'endDate', 'assigneeId', 'recurrenceRule'].includes(fieldEvent.dataField)
    ) {
      setConflictError(false);
      form?.validate();
    }
  });
};

const customizeItem = (item: DxFormTypes.SimpleItem) => {
  if (item.name === 'allDayEditor' || item.name === 'recurrenceEndEditor') {
    item.label!.visible = true;
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

const onOverlappingRuleChanged = (e: DxSelectBoxTypes.ValueChangedEvent) => {
  overlappingRule = e.value;
};
</script>

<style>
.dx-scheduler-appointment {
  color: #242424;
}

.options {
  padding: 20px;
  background-color: rgba(191, 191, 191, 0.15);
  margin-top: 20px;
}

.option {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.hide-informer .dx-item:has(.conflict-informer) {
  display: none !important;
}

.conflict-informer {
  background-color: #FCEAE8;
  color: #C50F1F;
  font-size: 12px;
  padding: 8px 12px;
  height: 36px;
  box-sizing: border-box;
}

.dx-dialog .dx-overlay-content {
  width: 280px;
}

.dx-dialog .dx-dialog-content {
  padding-bottom: 16px;
}

.dx-dialog .dx-dialog-buttons {
  padding-top: 0;
  padding-bottom: 16px;
}

.dx-dialog .dx-toolbar-center,
.dx-dialog .dx-button {
  width: 100%;
}

.dx-scheduler-form-main-group .dx-item:last-child,
.dx-scheduler-form-main-group .dx-item:last-child .dx-field-item-content,
.dx-scheduler-form-main-group .dx-item:last-child .dx-item:last-child,
.dx-scheduler-form-main-group .dx-item:last-child .dx-item:last-child .dx-field-item-content {
  overflow: visible;
}


</style>
