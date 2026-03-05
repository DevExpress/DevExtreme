import React, {
  useCallback, useMemo, useRef,
} from 'react';
import Scheduler, {
  Form, Editing, Resource, Item, SchedulerTypes,
} from 'devextreme-react/scheduler';
import SelectBox from 'devextreme-react/select-box';
import type { FormRef, FormTypes } from 'devextreme-react/form';
import type { PopupRef } from 'devextreme-react/popup';
import type { TagBoxTypes } from 'devextreme-react/tag-box';
import { custom as customDialog } from 'devextreme/ui/dialog';
import { Template } from 'devextreme-react/core/template';
import dxScheduler from 'devextreme/ui/scheduler';
import { data, assignees, type Appointment, type Assignee } from './data.ts';

const currentDate = new Date(2026, 1, 10);
const views: SchedulerTypes.ViewType[] = ['day', 'week', 'workWeek', 'month'];

const overlappingRuleItems = [
  { value: 'sameResource', text: 'Allow across resources' },
  { value: 'allResources', text: 'Disallow all overlaps' },
];

function getNextDay(date: Date): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + 1);
  return next;
}

function getEndDate(occurrence: SchedulerTypes.Occurrence): Date {
  return (occurrence.appointmentData as Appointment).allDay
    ? getNextDay(occurrence.startDate)
    : occurrence.endDate;
}

function isOverlapping(
  a: SchedulerTypes.Occurrence,
  b: SchedulerTypes.Occurrence,
  overlappingRule: string,
): boolean {
  const aEnd = getEndDate(a);
  const bEnd = getEndDate(b);
  if ((a.startDate) >= bEnd || (b.startDate) >= aEnd) return false;
  if (overlappingRule === 'sameResource') {
    return (a.appointmentData as Appointment).assigneeId[0] === (b.appointmentData as Appointment).assigneeId[0];
  }
  return true;
}

function detectConflict(
  scheduler: dxScheduler,
  newAppointment: Appointment,
  overlappingRule: string,
): boolean {
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
      isOverlapping(newOccurrence, existingOccurrence, overlappingRule),
    ),
  );
}

const assigneeIdEditorOptions = {
  onValueChanged: (e: TagBoxTypes.ValueChangedEvent) => {
    if (e.value.length > 1) {
      e.component.option('value', [e.value[e.value.length - 1]]);
    }
  },
  tagTemplate: 'tagTemplate',
};

const tagTemplate = (itemData: Assignee) => (
  <div className="dx-tag-content" style={{ backgroundColor: itemData.color, borderColor: itemData.color }}>
    {itemData.text}
    <div className="dx-tag-remove-button"></div>
  </div>
);

const conflictInformerRender = () => (
  <div className="conflict-informer">This time slot conflicts with another appointment.</div>
);

const App = () => {
  const popupRef = useRef<PopupRef>(null);
  const formRef = useRef<FormRef>(null);
  const showConflictErrorRef = useRef(false);
  const overlappingRuleRef = useRef('sameResource');

  const setConflictError = useCallback((show: boolean) => {
    showConflictErrorRef.current = show;
    formRef.current?.instance().option('elementAttr.class', show ? '' : 'hide-informer');
  }, []);

  const alertConflictIfNeeded = useCallback((
    e: SchedulerTypes.AppointmentAddingEvent | SchedulerTypes.AppointmentUpdatingEvent,
    appointmentData: Appointment,
  ) => {
    if (!detectConflict(e.component, appointmentData, overlappingRuleRef.current)) {
      setConflictError(false);
      return;
    }

    e.cancel = true;

    if (popupRef.current?.instance().option('visible')) {
      setConflictError(true);
      formRef.current?.instance().validate();
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
  }, [setConflictError]);

  const onAppointmentAdding = useCallback((e: SchedulerTypes.AppointmentAddingEvent) => {
    alertConflictIfNeeded(e, e.appointmentData as Appointment);
  }, [alertConflictIfNeeded]);

  const onAppointmentUpdating = useCallback((e: SchedulerTypes.AppointmentUpdatingEvent) => {
    alertConflictIfNeeded(e, { ...e.appointmentData, ...e.newData } as Appointment);
  }, [alertConflictIfNeeded]);

  const popupOptions = useMemo(() => ({
    onInitialized: (e: any) => {
      popupRef.current = e.component;
    },
    onHidden: () => {
      setConflictError(false);
      formRef.current?.instance().updateData('assigneeId', []);
    },
  }), [setConflictError]);

  const onFormInitialized = useCallback((e: FormTypes.InitializedEvent) => {
    formRef.current = e.component;

    e.component.on('fieldDataChanged', (fieldEvent: any) => {
      if (
        showConflictErrorRef.current &&
        ['startDate', 'endDate', 'assigneeId', 'recurrenceRule'].includes(fieldEvent.dataField)
      ) {
        setConflictError(false);
        formRef.current?.instance().validate();
      }
    });
  }, [setConflictError]);

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
    <>
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
          fieldExpr="assigneeId"
          dataSource={assignees}
          valueExpr="id"
          colorExpr="color"
          icon="user"
          allowMultiple={true}
        />

        <Editing popup={popupOptions}>
          <Form
            labelMode="hidden"
            onInitialized={onFormInitialized}
            customizeItem={customizeItem}
            elementAttr={{ class: 'hide-informer' }}
          >
            <Item
              name="conflictInformer"
              render={conflictInformerRender}
            />
            <Item type="group" name="mainGroup">
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
                <Template name="tagTemplate" render={tagTemplate} />
              </Item>
            </Item>
            <Item type="group" name="recurrenceGroup" />
          </Form>
        </Editing>
      </Scheduler>

      <div className="options">
        <div className="option">
          <span>Overlapping Rule</span>
          <SelectBox
            items={overlappingRuleItems}
            valueExpr="value"
            displayExpr="text"
            defaultValue="sameResource"
            width={200}
            onValueChanged={(e: any) => { overlappingRuleRef.current = e.value; }}
          />
        </div>
      </div>
    </>
  );
};

export default App;
