import React from 'react';
import Scheduler, { Resource } from 'devextreme-react/scheduler';
import Query from 'devextreme/data/query';

import Appointment from './Appointment.js';
import AppointmentTooltip from './AppointmentTooltip.js';
import { data, moviesData, theatreData } from './data.js';

const currentDate = new Date(2021, 4, 25);
const views = ['day', 'week', 'timelineDay'];
const groups = ['theatreId'];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.onAppointmentFormOpening = this.onAppointmentFormOpening.bind(this);
  }
  render() {
    return (
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
        editing={{ allowAdding: false }}
        appointmentComponent={Appointment}
        appointmentTooltipComponent={AppointmentTooltip}
        onAppointmentFormOpening={this.onAppointmentFormOpening}
      >
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
  }

  onAppointmentFormOpening(data) {
    let form = data.form,
      movieInfo = getMovieById(data.appointmentData.movieId) || {},
      startDate = data.appointmentData.startDate;

    form.option('items', [{
      label: {
        text: 'Movie'
      },
      editorType: 'dxSelectBox',
      dataField: 'movieId',
      editorOptions: {
        items: moviesData,
        displayExpr: 'text',
        valueExpr: 'id',
        onValueChanged: function(args) {
          movieInfo = getMovieById(args.value);
          form.getEditor('director')
            .option('value', movieInfo.director);
          form.getEditor('endDate')
            .option('value', new Date(startDate.getTime() +
              60 * 1000 * movieInfo.duration));
        }
      },
    }, {
      label: {
        text: 'Director'
      },
      name: 'director',
      editorType: 'dxTextBox',
      editorOptions: {
        value: movieInfo.director,
        readOnly: true
      }
    }, {
      dataField: 'startDate',
      editorType: 'dxDateBox',
      editorOptions: {
        width: '100%',
        type: 'datetime',
        onValueChanged: function(args) {
          startDate = args.value;
          form.getEditor('endDate')
            .option('value', new Date(startDate.getTime() +
              60 * 1000 * movieInfo.duration));
        }
      }
    }, {
      name: 'endDate',
      dataField: 'endDate',
      editorType: 'dxDateBox',
      editorOptions: {
        width: '100%',
        type: 'datetime',
        readOnly: true
      }
    }, {
      dataField: 'price',
      editorType: 'dxRadioGroup',
      editorOptions: {
        dataSource: [5, 10, 15, 20],
        itemTemplate: function(itemData) {
          return `$${itemData}`;
        }
      }
    }
    ]);
  }
}

function getMovieById(id) {
  return Query(moviesData).filter(['id', id]).toArray()[0];
}

export default App;
