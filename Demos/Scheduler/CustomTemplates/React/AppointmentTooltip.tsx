import React, { useMemo } from 'react';
import Query from 'devextreme/data/query';
import { SchedulerTypes } from 'devextreme-react/scheduler';

import { moviesData } from './data.ts';

const getMovieById = (id) => Query(moviesData).filter(['id', id]).toArray()[0];

type AppointmentProps = {
  data: { appointmentData: SchedulerTypes.Appointment & { movieId: number }; }
};

const AppointmentTooltip = (props: AppointmentProps) => {
  const { movieId } = props.data.appointmentData;

  const movieData = useMemo(() => getMovieById(movieId), [movieId]);

  return (
    <div className="movie-tooltip">
      <img src={movieData.image} />
      <div className="movie-info">
        <div className="movie-title">
          {movieData.text} ({movieData.year})
        </div>
        <div>
          Director: {movieData.director}
        </div>
        <div>
          Duration: {movieData.duration} minutes
        </div>
      </div>
    </div>
  );
};

export default AppointmentTooltip;
