import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import Scheduler from 'devextreme-react/scheduler';
import Switch from 'devextreme-react/switch';
import notify from 'devextreme/ui/notify';
import dxForm from 'devextreme/ui/form';
import { data, projects } from './data.js';

const currentDate = new Date(2026, 1, 10);
const views = ['day', 'week'];
const resources = [{
  fieldExpr: 'projectId',
  dataSource: projects,
  valueExpr: 'id',
  colorExpr: 'color',
}];

function isOverlapping(a, b) {
  return a.startDate < b.endDate && a.endDate > b.startDate;
}

const App = () => {
  const schedulerRef = useRef(null);
  const [allowOverlapping, setAllowOverlapping] = useState(false);
  const allowOverlappingRef = useRef(allowOverlapping);

  useEffect(() => {
    allowOverlappingRef.current = allowOverlapping;
  }, [allowOverlapping]);

  const detectConflict = useCallback((newAppt) => {
    const scheduler = schedulerRef.current?.instance?.();
    if (!scheduler) return false;

    const allItems = scheduler.getDataSource().items();

    const existingOccurrences = scheduler
      .getOccurrences(newAppt.startDate, newAppt.endDate, allItems)
      .filter((occ) => occ.appointmentData.id !== newAppt.id);

    const expandEnd = new Date(newAppt.endDate);
    expandEnd.setDate(expandEnd.getDate() + 14);

    const newOccurrences = scheduler.getOccurrences(
      newAppt.startDate,
      expandEnd,
      [newAppt],
    );

    return newOccurrences.some((newOcc) =>
      existingOccurrences.some((existingOcc) => isOverlapping(newOcc, existingOcc)),
    );
  }, []);

  const onAppointmentAdding = useCallback((e) => {
    if (allowOverlapping) return;

    if (detectConflict(e.appointmentData)) {
      e.cancel = true;
      notify('Cannot create an appointment that overlaps with an existing one.', 'warning', 2000);
    }
  }, [allowOverlapping, detectConflict]);

  const onAppointmentUpdating = useCallback((e) => {
    if (allowOverlapping) return;

    const updatedAppt = { ...e.appointmentData, ...e.newData };
    if (detectConflict(updatedAppt)) {
      e.cancel = true;
      notify('Cannot move an appointment to a time slot that is already occupied.', 'warning', 2000);
    }
  }, [allowOverlapping, detectConflict]);

  const onAllowOverlappingChanged = useCallback((e) => {
    setAllowOverlapping(e.value);
  }, []);

  const onAppointmentFormOpening = useCallback((e) => {
    const { form } = e;
    const items = form.option('items');
    if (!items.some((item) => item.name === 'conflictInformer')) {
      form.option('items', [
        {
          name: 'conflictInformer',
          itemType: 'simple',
          label: { visible: false },
          template: (_, element) => {
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
  }, []);

  const editing = useMemo(() => ({
    form: {
      customizeItem(item) {
        if (item.name === 'endDateEditor') {
          const alreadyAdded = (item.validationRules ?? []).some(
            (r) => r.type === 'custom' && r.message === 'This time slot conflicts with another appointment.',
          );
          if (alreadyAdded) return;
          item.validationRules = [
            ...(item.validationRules ?? []),
            {
              type: 'custom',
              message: 'This time slot conflicts with another appointment.',
              validationCallback({ validator }) {
                if (allowOverlappingRef.current) return true;
                const formEl = validator.$element().closest('.dx-form')[0];
                const formInstance = dxForm.getInstance(formEl);
                if (!formInstance) return true;
                const formData = formInstance.option('formData');
                const hasConflict = detectConflict(formData);
                const informerEl = formEl.querySelector('.conflict-informer');
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
  }), [detectConflict]);

  return (
    <React.Fragment>
      <Scheduler
        ref={schedulerRef}
        dataSource={data}
        views={views}
        defaultCurrentView="week"
        defaultCurrentDate={currentDate}
        startDayHour={9}
        endDayHour={19}
        height={600}
        resources={resources}
        editing={editing}
        onAppointmentAdding={onAppointmentAdding}
        onAppointmentUpdating={onAppointmentUpdating}
        onAppointmentFormOpening={onAppointmentFormOpening}
      />
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <span>Allow Appointment Overlapping</span>
          <Switch
            value={allowOverlapping}
            onValueChanged={onAllowOverlappingChanged}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default App;
