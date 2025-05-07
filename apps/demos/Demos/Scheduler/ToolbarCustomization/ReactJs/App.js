import React, {
  useCallback, useMemo, useRef, useState,
} from 'react';
import Scheduler, { Toolbar, Item, Resource } from 'devextreme-react/scheduler';
import TagBox from 'devextreme-react/cjs/tag-box';
import { data, assignees } from './data.js';

const initialCurrentDate = new Date(2021, 3, 27);
const views = ['day', 'week', 'workWeek', 'month'];
const inputAttr = { 'aria-label': 'Assignees' };
const elementAttr = { class: 'assignees-tag-box' };
const App = () => {
  const schedulerRef = useRef(null);
  const [currentDate, setCurrentDate] = useState(initialCurrentDate);
  const [assigneesFilterValue, setAssigneesFilterValue] = useState([]);
  const filteredData = useMemo(
    () =>
      (assigneesFilterValue.length
        ? data.filter((item) => assigneesFilterValue.some((id) => item.assigneeId.includes(id)))
        : data),
    [assigneesFilterValue],
  );
  const onAssigneesFilterChange = useCallback((event) => {
    setAssigneesFilterValue(event.value);
  }, []);
  const dateNavigatorOptions = useMemo(
    () => ({
      onItemClick: (event) => {
        if (event.itemData.key === 'today') {
          setCurrentDate(new Date());
        }
      },
      items: [{ key: 'today', text: 'Today' }, 'prev', 'next', 'current'],
    }),
    [],
  );
  const toggleButtonOptions = useMemo(
    () => ({
      icon: 'plus',
      text: 'New event',
      onClick: () => {
        schedulerRef.current?.instance().showAppointmentPopup(
          {
            startDate: new Date(),
          },
          true,
        );
      },
    }),
    [],
  );
  return (
    <Scheduler
      timeZone="America/Los_Angeles"
      dataSource={filteredData}
      views={views}
      defaultCurrentView="workWeek"
      defaultCurrentDate={currentDate}
      startDayHour={9}
      endDayHour={19}
      height={600}
      ref={schedulerRef}
    >
      <Resource
        dataSource={assignees}
        allowMultiple={true}
        fieldExpr="assigneeId"
        label="Assignee"
      />
      <Toolbar>
        <Item
          location="before"
          name="dateNavigator"
          options={dateNavigatorOptions}
        />
        <Item
          location="before"
          locateInMenu="auto"
          widget="dxButton"
          options={toggleButtonOptions}
        />
        <Item
          location="center"
          locateInMenu="auto"
        >
          <TagBox
            items={assignees}
            displayExpr="text"
            valueExpr="id"
            showSelectionControls={true}
            maxDisplayedTags={1}
            inputAttr={inputAttr}
            elementAttr={elementAttr}
            value={assigneesFilterValue}
            onValueChanged={onAssigneesFilterChange}
          />
        </Item>
        <Item
          location="after"
          locateInMenu="auto"
          name="columnChooserButton"
        />
      </Toolbar>
    </Scheduler>
  );
};
export default App;
