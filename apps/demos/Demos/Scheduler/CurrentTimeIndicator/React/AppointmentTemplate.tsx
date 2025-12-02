import React from 'react';
import { query as Query } from 'devextreme-react/common/data';
import { type SchedulerTypes } from 'devextreme-react/scheduler';
import { moviesData } from './data.ts';

type AppointmentTemplateProps = {
  data: { appointmentData: SchedulerTypes.Appointment; };
};

const getMovieById = (id) => Query(moviesData).filter(['id', id]).toArray()[0];

const AppointmentTemplate = (props: AppointmentTemplateProps) => {
  const { appointmentData } = props.data;

  const movieInfo = getMovieById(appointmentData.movieId) || {};

  return (
    <div className="movie">
      <img src={movieInfo.image} alt={`${movieInfo.text} poster`} />
      <div className="movie-text">{movieInfo.text}</div>
    </div>
  );
};

export default AppointmentTemplate;
