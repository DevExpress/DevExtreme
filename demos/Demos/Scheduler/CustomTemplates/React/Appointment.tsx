import React, { useMemo } from 'react';
import Query from 'devextreme/data/query';
import { formatDate } from 'devextreme/localization';
import { SchedulerTypes } from 'devextreme-react/scheduler';
import { moviesData } from './data.ts';

const getMovieById = (id) => Query(moviesData).filter(['id', id]).toArray()[0];

type AppointmentProps = {
  data: { targetedAppointmentData: SchedulerTypes.Appointment; }
};

const Appointment = (props: AppointmentProps) => {
  const { targetedAppointmentData } = props.data;
  const { movieId } = targetedAppointmentData;

  const movieData = useMemo(() => getMovieById(movieId), [movieId]);

  return (
    <div className="showtime-preview">
      <div> {movieData.text}</div>
      <div>
        Ticket Price: <strong>${ targetedAppointmentData.price }</strong>
      </div>
      <div>
        {formatDate(targetedAppointmentData.displayStartDate, 'shortTime')}
        {' - '}
        {formatDate(targetedAppointmentData.displayEndDate, 'shortTime')}
      </div>
    </div>
  );
};

export default Appointment;
