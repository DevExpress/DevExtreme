import React, { useCallback, useState } from 'react';

import Scheduler, { Resource, View } from 'devextreme-react/scheduler';
import type { SchedulerTypes } from 'devextreme-react/scheduler';
import { appointments, assignees } from './data.ts';

const currentDate = new Date(2026, 6, 13);

const groups = ['assigneeId'];

type Form = SchedulerTypes.AppointmentFormOpeningEvent['form'];
type FormItem = {
  name?: string;
  dataField?: string;
  items?: FormItem[];
  [key: string]: unknown;
};
type FoundItem = { list: FormItem[]; index: number } | null;

const rooms = assignees.filter((item) => item.parentId === null);

const employeesOf = (roomId: string | null) => assignees
  .filter((item) => item.parentId === roomId);

const roomOf = (assigneeId: number | undefined): string | null => assignees
  .find((item) => item.id === assigneeId)?.parentId ?? null;

const findItem = (items: FormItem[], predicate: (item: FormItem) => boolean): FoundItem => {
  for (let i = 0; i < items.length; i += 1) {
    if (predicate(items[i])) {
      return { list: items, index: i };
    }

    const nested = items[i].items;

    if (nested) {
      const found = findItem(nested, predicate);

      if (found) {
        return found;
      }
    }
  }

  return null;
};

const createRoomGroup = (form: Form, roomId: string | null): FormItem => ({
  itemType: 'group',
  name: 'roomGroup',
  cssClass: 'dx-scheduler-form-group-with-icon',
  colCount: 2,
  colCountByScreen: { xs: 2 },
  items: [
    {
      colSpan: 1,
      name: 'roomIcon',
      cssClass: 'dx-scheduler-form-icon',
      template: () => '<div class="dx-icon dx-icon-conferenceroomoutline"></div>',
    },
    {
      itemType: 'simple',
      name: 'roomEditor',
      colSpan: 1,
      label: { visible: false },
      editorType: 'dxSelectBox',
      editorOptions: {
        dataSource: rooms,
        displayExpr: 'shortText',
        valueExpr: 'id',
        value: roomId,
        placeholder: 'Room',
        stylingMode: form.getEditor('assigneeId')?.option('stylingMode'),
        onValueChanged(e: { value: string }) {
          const editor = form.getEditor('assigneeId');

          editor?.option('dataSource', e.value ? employeesOf(e.value) : []);
          editor?.option('value', []);
        },
      },
    },
  ],
});

const renderEmployeeTag = (data: { text: string; color?: string }) => {
  const tag = document.createElement('div');

  tag.className = 'dx-tag-content';
  tag.style.backgroundColor = data.color ?? '';
  tag.style.borderColor = data.color ?? 'transparent';
  tag.textContent = data.text;

  const removeButton = document.createElement('div');

  removeButton.className = 'dx-tag-remove-button';
  tag.appendChild(removeButton);

  return tag;
};

const hideLabels = (items: FormItem[]) => {
  items.forEach((item) => {
    if (item.items) {
      hideLabels(item.items);
    } else if (item.dataField !== 'allDay') {
      item.label = { ...(item.label as object), visible: false };
    }
  });
};

const roomIdOf = (
  appointmentData: SchedulerTypes.AppointmentFormOpeningEvent['appointmentData'],
): string | null => {
  const assigneeIds = appointmentData?.assigneeId as number | number[] | undefined;
  const [assigneeId] = Array.isArray(assigneeIds) ? assigneeIds : [assigneeIds];

  return roomOf(assigneeId);
};

const requireEmployee = (items: FormItem[]) => {
  const found = findItem(items, (item) => item.dataField === 'assigneeId');

  if (!found) {
    return;
  }

  const item = found.list[found.index];

  item.validationRules = [{ type: 'required', message: 'Employee is required' }];
  item.editorOptions = { ...(item.editorOptions as object), tagTemplate: renderEmployeeTag };
};

const hideGroup = (items: FormItem[], name: string) => {
  const found = findItem(items, (item) => item.name === name);

  if (found) {
    found.list[found.index].visible = false;
  }
};

const onAppointmentFormOpening = (e: SchedulerTypes.AppointmentFormOpeningEvent) => {
  const { form } = e;
  const items = form.option('items') as FormItem[];

  if (findItem(items, (item) => item.name === 'roomGroup')) {
    return;
  }

  const roomId = roomIdOf(e.appointmentData);
  const mainGroup = items.find((item) => item.name === 'mainGroup');
  const employee = findItem(items, (item) => item.name === 'assigneeIdGroup');
  const repeatValue = form.getEditor('repeatEditor')?.option('value');

  employee?.list.splice(employee.index, 0, createRoomGroup(form, roomId));
  hideLabels(mainGroup?.items ?? []);
  requireEmployee(items);
  hideGroup(items, 'descriptionGroup');

  form.option('items', items.slice());

  form.getEditor('repeatEditor')?.option('value', repeatValue);
  form.getEditor('assigneeId')?.option('dataSource', roomId ? employeesOf(roomId) : []);
};

const App = () => {
  const [crossScrollingEnabled, setCrossScrollingEnabled] = useState(false);

  const onOptionChanged = useCallback((e: SchedulerTypes.OptionChangedEvent) => {
    if (e.name === 'currentView') {
      setCrossScrollingEnabled(e.value === 'Horizontal Grouping');
    }
  }, []);

  return (
    <Scheduler
      dataSource={appointments}
      groups={groups}
      defaultCurrentView="Vertical Grouping"
      defaultCurrentDate={currentDate}
      startDayHour={9}
      endDayHour={16}
      crossScrollingEnabled={crossScrollingEnabled}
      showAllDayPanel={false}
      showCurrentTimeIndicator={false}
      height={700}
      onOptionChanged={onOptionChanged}
      onAppointmentFormOpening={onAppointmentFormOpening}
    >
      <View
        name="Vertical Grouping"
        type="workWeek"
        groupOrientation="vertical"
        cellDuration={60}
      />
      <View
        name="Horizontal Grouping"
        type="workWeek"
        groupOrientation="horizontal"
      />
      <Resource
        fieldExpr="assigneeId"
        dataSource={assignees}
        parentIdExpr="parentId"
        label="Employee"
        allowMultiple={true}
        icon="user"
      />
    </Scheduler>
  );
};

export default App;
