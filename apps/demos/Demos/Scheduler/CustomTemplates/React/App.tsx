import React from 'react';
import Scheduler, { Editing, Resource, SchedulerTypes } from 'devextreme-react/scheduler';
import Query from 'devextreme/data/query';
import { SelectBoxTypes } from 'devextreme-react/select-box';
import { DateBoxTypes } from 'devextreme-react/date-box';
import Appointment from './Appointment.tsx';
import AppointmentTooltip from './AppointmentTooltip.tsx';
import {
  data, moviesData, theatreData, Appointment as AppointmentType,
} from './data.ts';

const currentDate = new Date(2021, 3, 27);
const views: SchedulerTypes.ViewType[] = ['day', 'week', 'timelineDay'];
const groups = ['theatreId'];

const onAppointmentFormOpening = (e: SchedulerTypes.AppointmentFormOpeningEvent) => {
  let movieInfo = getMovieById((e.appointmentData as AppointmentType).movieId) || {};
  let { startDate } = e.appointmentData!;

  e.form.option('items', [{
    label: {
      text: 'Movie',
    },
    editorType: 'dxSelectBox',
    dataField: 'movieId',
    editorOptions: {
      items: moviesData,
      displayExpr: 'text',
      valueExpr: 'id',
      onValueChanged(args: SelectBoxTypes.ValueChangedEvent) {
        movieInfo = getMovieById(args.value);

        e.form.updateData('director', movieInfo.director);
        e.form.updateData('endDate', new Date((startDate as Date).getTime() + 60 * 1000 * movieInfo.duration));
      },
    },
  }, {
    label: {
      text: 'Director',
    },
    name: 'director',
    editorType: 'dxTextBox',
    editorOptions: {
      value: movieInfo.director,
      readOnly: true,
    },
  }, {
    dataField: 'startDate',
    editorType: 'dxDateBox',
    editorOptions: {
      width: '100%',
      type: 'datetime',
      onValueChanged(args: DateBoxTypes.ValueChangedEvent) {
        startDate = args.value;
        e.form.updateData('endDate', new Date((startDate as Date).getTime() + 60 * 1000 * movieInfo.duration));
      },
    },
  }, {
    name: 'endDate',
    dataField: 'endDate',
    editorType: 'dxDateBox',
    editorOptions: {
      width: '100%',
      type: 'datetime',
      readOnly: true,
    },
  }, {
    dataField: 'price',
    editorType: 'dxRadioGroup',
    editorOptions: {
      dataSource: [5, 10, 15, 20],
      itemTemplate(itemData) {
        return `$${itemData}`;
      },
    },
  },
  ]);
};

const getMovieById = (id) => Query(moviesData).filter(['id', id]).toArray()[0];

const App = () => (
  <Scheduler
    timeZone="America/Los_Angeles"
    dataSource={data}
    views={views}
    defaultCurrentView="day"
    defaultCurrentDate={currentDate}
    groups={groups}
    height={600}
    firstDayOfWeek={0}
    startDayHour={9}
    endDayHour={23}
    showAllDayPanel={false}
    crossScrollingEnabled={true}
    cellDuration={20}
    appointmentComponent={Appointment}
    appointmentTooltipComponent={AppointmentTooltip}
    onAppointmentFormOpening={onAppointmentFormOpening}
  >
    <Editing allowAdding={false} />
    <Resource
      dataSource={moviesData}
      fieldExpr="movieId"
      useColorAsDefault={true}
    />
    <Resource
      dataSource={theatreData}
      fieldExpr="theatreId"
    />
  </Scheduler>
);

export default App;
