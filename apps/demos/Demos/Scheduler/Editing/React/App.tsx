import React, { useCallback, useState } from 'react';
import Scheduler, { Editing, SchedulerTypes } from 'devextreme-react/scheduler';
import { CheckBox, CheckBoxTypes } from 'devextreme-react/check-box';
import notify from 'devextreme/ui/notify';

import { data } from './data.ts';

const currentDate = new Date(2021, 3, 29);
const views: SchedulerTypes.ViewType[] = ['day', 'week'];

const showToast = (event: string, value, type: string) => {
  notify(`${event} "${value}" task`, type, 800);
};

const showAddedToast = (e: SchedulerTypes.AppointmentAddedEvent) => {
  showToast('Added', e.appointmentData.text, 'success');
};

const showUpdatedToast = (e: SchedulerTypes.AppointmentUpdatedEvent) => {
  showToast('Updated', e.appointmentData.text, 'info');
};

const showDeletedToast = (e: SchedulerTypes.AppointmentDeletedEvent) => {
  showToast('Deleted', e.appointmentData.text, 'warning');
};

const App = () => {
  const [allowAdding, setAllowAdding] = useState(true);
  const [allowDeleting, setAllowDeleting] = useState(true);
  const [allowResizing, setAllowResizing] = useState(true);
  const [allowDragging, setAllowDragging] = useState(true);
  const [allowUpdating, setAllowUpdating] = useState(true);

  const onAllowAddingChanged = useCallback((e: CheckBoxTypes.ValueChangedEvent) => setAllowAdding(e.value), []);

  const onAllowDeletingChanged = useCallback((e: CheckBoxTypes.ValueChangedEvent) => setAllowDeleting(e.value), []);

  const onAllowResizingChanged = useCallback((e: CheckBoxTypes.ValueChangedEvent) => setAllowResizing(e.value), []);

  const onAllowDraggingChanged = useCallback((e: CheckBoxTypes.ValueChangedEvent) => setAllowDragging(e.value), []);

  const onAllowUpdatingChanged = useCallback((e: CheckBoxTypes.ValueChangedEvent) => setAllowUpdating(e.value), []);

  return (
    <React.Fragment>
      <Scheduler
        timeZone="America/Los_Angeles"
        dataSource={data}
        views={views}
        defaultCurrentView="week"
        defaultCurrentDate={currentDate}
        startDayHour={9}
        endDayHour={19}
        height={600}
        onAppointmentAdded={showAddedToast}
        onAppointmentUpdated={showUpdatedToast}
        onAppointmentDeleted={showDeletedToast}
      >
        <Editing
          allowAdding={allowAdding}
          allowDeleting={allowDeleting}
          allowResizing={allowResizing}
          allowDragging={allowDragging}
          allowUpdating={allowUpdating}
        />
      </Scheduler>
      <div className="options">
        <div className="caption">Options</div>
        <div className="options-container">
          <div className="option">
            <CheckBox
              defaultValue={allowAdding}
              text="Allow adding"
              onValueChanged={onAllowAddingChanged}
            />
          </div>
          <div className="option">
            <CheckBox
              defaultValue={allowDeleting}
              text="Allow deleting"
              onValueChanged={onAllowDeletingChanged}
            />
          </div>
          <div className="option">
            <CheckBox
              defaultValue={allowUpdating}
              text="Allow updating"
              onValueChanged={onAllowUpdatingChanged}
            />
          </div>
          <div className="option">
            <CheckBox
              defaultValue={allowResizing}
              text="Allow resizing"
              onValueChanged={onAllowResizingChanged}
              disabled={!allowUpdating}
            />
          </div>
          <div className="option">
            <CheckBox
              defaultValue={allowDragging}
              text="Allow dragging"
              onValueChanged={onAllowDraggingChanged}
              disabled={!allowUpdating}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default App;
