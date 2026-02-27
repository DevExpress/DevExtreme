import React, {
  useCallback, useMemo, useRef,
} from 'react';
import Scheduler, { Form, Editing, Resource, Item, SchedulerTypes } from 'devextreme-react/scheduler';
import type { FormRef, FormTypes } from 'devextreme-react/form';
import type { PopupRef } from 'devextreme-react/popup';
import type { TagBoxTypes } from 'devextreme-react/tag-box';
import { custom as customDialog } from 'devextreme/ui/dialog';
import dxScheduler from 'devextreme/ui/scheduler';
import { data, assignees, type Appointment, Assignee } from './data.ts';

const currentDate = new Date(2026, 1, 10);
const views: SchedulerTypes.ViewType[] = ['day', 'week'];

function isOverlapping(a: SchedulerTypes.Occurrence, b: SchedulerTypes.Occurrence): boolean {
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
  onValueChanged: (e: TagBoxTypes.ValueChangedEvent) => {
    if (e.value.length > 1) {
      e.component.option('value', [e.value[e.value.length - 1]]);
    }
  },
  tagTemplate: (itemData: Assignee, tagElement: HTMLElement) => {
    const root = document.createElement('div');
    root.className = 'dx-tag-content';
    root.style.backgroundColor = itemData.color;
    root.style.borderColor = itemData.color;

    const span = document.createElement('span');
    span.textContent = itemData.text;
    root.appendChild(span);

    const div = document.createElement('div');
    div.className = 'dx-tag-remove-button';
    root.appendChild(div);

    tagElement.appendChild(root);
  },
};

const conflictInformerRender = () => (
  <div className="conflict-informer">This time slot conflicts with another appointment</div>
);

const App = () => {
  const popupRef = useRef<PopupRef>(null);
  const formRef = useRef<FormRef>(null);
  const showConflictErrorRef = useRef(false);

  const alertConflictIfNeeded = useCallback((e: SchedulerTypes.AppointmentAddingEvent | SchedulerTypes.AppointmentUpdatingEvent, appointmentData: Appointment) => {
    const hasConflict = detectConflict(e.component, appointmentData);

    if (!hasConflict) {
      showConflictErrorRef.current = false;
      return;
    }

    e.cancel = true;

    if (popupRef.current.instance().option('visible')) {
      showConflictErrorRef.current = true;
      formRef.current.instance().validate();
      formRef.current.instance().option('elementAttr.class', '');
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
  }, []);

  const onAppointmentAdding = useCallback((e: SchedulerTypes.AppointmentAddingEvent) => {
    alertConflictIfNeeded(e, e.appointmentData as Appointment);
  }, [alertConflictIfNeeded]);

  const onAppointmentUpdating = useCallback((e: SchedulerTypes.AppointmentUpdatingEvent) => {
    alertConflictIfNeeded(e, e.newData);
  }, [alertConflictIfNeeded]);

  const popupOptions = useMemo(() => ({
    onInitialized: (e: any) => {
      popupRef.current = e.component;
    },
  }), []);

  const onFormInitialized = useCallback((e: FormTypes.InitializedEvent) => {
    formRef.current = e.component;

    const defaultFieldDataChangedHandler = e.component.option('onFieldDataChanged');

    e.component.option('onFieldDataChanged', (fieldEvent: any) => {
      if (defaultFieldDataChangedHandler) {
        defaultFieldDataChangedHandler(fieldEvent);
      }
      if (
        showConflictErrorRef.current &&
        ['startDate', 'endDate', 'assigneeId'].includes(fieldEvent.dataField)
      ) {
        showConflictErrorRef.current = false;
        formRef.current.instance().option('elementAttr.class', 'hide-informer');
        formRef.current.instance().validate();
      }
    });
  }, [formRef]);

  const customizeItem = useCallback((item: FormTypes.SimpleItem) => {
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
          validationCallback: () => !showConflictErrorRef.current,
        },
      ];
    }
  }, []);

  return (
    <Scheduler
      dataSource={data}
      views={views}
      defaultCurrentView="week"
      defaultCurrentDate={currentDate}
      startDayHour={9}
      endDayHour={19}
      height={600}
      showAllDayPanel={false}
      onAppointmentAdding={onAppointmentAdding}
      onAppointmentUpdating={onAppointmentUpdating}
    >
      <Resource
        fieldExpr='assigneeId'
        dataSource={assignees}
        valueExpr='id'
        colorExpr='color'
        icon='user'
        allowMultiple={true}
      />

      <Editing
        popup={popupOptions}
      >
        <Form
          labelMode="hidden"
          onInitialized={onFormInitialized}
          customizeItem={customizeItem}
          elementAttr={{ class: 'hide-informer' }}
        >
          <Item type="group" name="mainGroup">
            <Item
              name="conflictInformer"
              render={conflictInformerRender}
            />
            <Item name="subjectGroup" />
            <Item name="dateGroup" />
            <Item name="repeatGroup" />
            <Item name="assigneeIdGroup">
              <Item name="assigneeIdIcon" />
              <Item
                name="assigneeId"
                isRequired={true}
                editorOptions={assigneeIdEditorOptions}
              />
            </Item>
          </Item>
          <Item type="group" name="recurrenceGroup" />
        </Form>
      </Editing>
    </Scheduler>
  );
};

export default App;
