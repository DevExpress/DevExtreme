import React, { useCallback, useMemo, useRef } from 'react';
import Scheduler, {
  Form, Editing, Resource, Item,
} from 'devextreme-react/scheduler';
import SelectBox from 'devextreme-react/select-box';
import { custom as customDialog } from 'devextreme/ui/dialog';
import { data, assignees } from './data.js';

const currentDate = new Date(2026, 1, 10);
const views = ['day', 'week', 'workWeek', 'month'];
const overlappingRuleItems = [
  { value: 'sameResource', text: 'Allow across resources' },
  { value: 'allResources', text: 'Disallow all overlaps' },
];
function getNextDay(date) {
  const next = new Date(date);
  next.setDate(next.getDate() + 1);
  return next;
}
function getEndDate(occurrence) {
  return occurrence.appointmentData.allDay ? getNextDay(occurrence.startDate) : occurrence.endDate;
}
function isOverlapping(a, b, overlappingRule) {
  const aEnd = getEndDate(a);
  const bEnd = getEndDate(b);
  if (a.startDate >= bEnd || b.startDate >= aEnd) return false;
  if (overlappingRule === 'sameResource') {
    return a.appointmentData.assigneeId[0] === b.appointmentData.assigneeId[0];
  }
  return true;
}
function detectConflict(scheduler, newAppointment, overlappingRule) {
  const allAppointments = scheduler.getDataSource().items();
  const startDate = new Date(newAppointment.startDate);
  let endDate;
  if (newAppointment.recurrenceRule) {
    endDate = scheduler.getEndViewDate();
  } else if (newAppointment.allDay) {
    endDate = getNextDay(startDate);
  } else {
    endDate = new Date(newAppointment.endDate);
  }
  const existingOccurrences = scheduler
    .getOccurrences(startDate, endDate, allAppointments)
    .filter((occurrence) => occurrence.appointmentData.id !== newAppointment.id);
  const newOccurrences = scheduler.getOccurrences(startDate, endDate, [newAppointment]);
  return newOccurrences.some((newOccurrence) =>
    existingOccurrences.some((existingOccurrence) =>
      isOverlapping(newOccurrence, existingOccurrence, overlappingRule),
    ),
  );
}
const assigneeIdEditorOptions = {
  onValueChanged: (e) => {
    if (e.value.length > 1) {
      e.component.option('value', [e.value[e.value.length - 1]]);
    }
  },
  tagRender: (itemData) => tagTemplate(itemData),
};
const tagTemplate = (itemData) => (
  <div
    className="dx-tag-content"
    style={{ backgroundColor: itemData.color, borderColor: itemData.color }}
  >
    {itemData.text}
    <div className="dx-tag-remove-button"></div>
  </div>
);
const conflictInformerRender = () => (
  <div className="conflict-informer">This time slot conflicts with another appointment.</div>
);
const App = () => {
  const popupRef = useRef(null);
  const formRef = useRef(null);
  const showConflictErrorRef = useRef(false);
  const overlappingRuleRef = useRef('sameResource');
  const setConflictError = useCallback((show) => {
    showConflictErrorRef.current = show;
    formRef.current?.option('elementAttr.class', show ? '' : 'hide-informer');
  }, []);
  const alertConflictIfNeeded = useCallback(
    (e, appointmentData) => {
      if (!detectConflict(e.component, appointmentData, overlappingRuleRef.current)) {
        setConflictError(false);
        return;
      }
      e.cancel = true;
      if (popupRef.current?.option('visible')) {
        setConflictError(true);
        formRef.current?.validate();
      } else {
        const dialog = customDialog({
          showTitle: false,
          messageHtml: 'This time slot conflicts with another appointment.',
          buttons: [
            {
              type: 'default',
              text: 'Close',
              stylingMode: 'contained',
              onClick: () => {
                dialog.hide();
              },
            },
          ],
        });
        dialog.show();
      }
    },
    [setConflictError],
  );
  const onAppointmentAdding = useCallback(
    (e) => {
      alertConflictIfNeeded(e, e.appointmentData);
    },
    [alertConflictIfNeeded],
  );
  const onAppointmentUpdating = useCallback(
    (e) => {
      alertConflictIfNeeded(e, { ...e.oldData, ...e.newData });
    },
    [alertConflictIfNeeded],
  );
  const popupOptions = useMemo(
    () => ({
      onInitialized: (e) => {
        popupRef.current = e.component ?? null;
      },
      onHidden: () => {
        setConflictError(false);
        formRef.current?.updateData('assigneeId', []);
      },
    }),
    [setConflictError],
  );
  const onFormInitialized = useCallback(
    (e) => {
      if (!e.component) return;
      formRef.current = e.component;
      e.component.on('fieldDataChanged', (fieldEvent) => {
        if (
          showConflictErrorRef.current &&
          ['startDate', 'endDate', 'assigneeId', 'recurrenceRule'].includes(
            fieldEvent.dataField ?? '',
          )
        ) {
          setConflictError(false);
          formRef.current?.validate();
        }
      });
    },
    [setConflictError],
  );
  const customizeItem = useCallback((item) => {
    if (item.name === 'allDayEditor' || item.name === 'recurrenceEndEditor') {
      item.label = { ...item.label, visible: true };
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
            <Item
              type="group"
              name="mainGroup"
            >
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
            <Item
              type="group"
              name="recurrenceGroup"
            />
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
            onValueChanged={(e) => {
              overlappingRuleRef.current = e.value;
            }}
          />
        </div>
      </div>
    </>
  );
};
export default App;
