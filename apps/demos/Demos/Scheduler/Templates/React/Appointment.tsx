import React, { useMemo } from 'react';
import { query as Query } from 'devextreme-react/common/data';
import { formatDate } from 'devextreme-react/common/core/localization';
import type { SchedulerTypes } from 'devextreme-react/scheduler';
import { moviesData } from './data.ts';

const getMovieById = (id: number) => Query(moviesData).filter(['id', id]).toArray()[0];

type AppointmentProps = {
  data: { targetedAppointmentData: SchedulerTypes.Appointment; }
};

const Appointment = (props: AppointmentProps) => {
  const { targetedAppointmentData } = props.data;
  const { movieId, price, displayStartDate, displayEndDate } = targetedAppointmentData;

  const movieData = useMemo(() => getMovieById(movieId), [movieId]);

  return (
    <div className="movie-preview">
      <div className="movie-preview-image">
        <img src={movieData.image} alt={`${movieData.text} poster`} />
      </div>
      <div className="movie-details">
        <div className="title">{movieData.text}</div>
        <div>Ticket Price: <b>${price}</b></div>
        <div>
          {formatDate(displayStartDate, 'shortTime')}
          {' - '}
          {formatDate(displayEndDate, 'shortTime')}
        </div>
      </div>
    </div>
  );
};

export default Appointment;
