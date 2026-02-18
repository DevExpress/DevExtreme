import React, { useMemo } from 'react';
import { query as Query } from 'devextreme-react/common/data';
import type { SchedulerTypes } from 'devextreme-react/scheduler';

import { moviesData } from './data.ts';

const getMovieById = (id: number) => Query(moviesData).filter(['id', id]).toArray()[0];

type AppointmentProps = {
  data: { appointmentData: SchedulerTypes.Appointment & { movieId: number } };
};

const AppointmentTooltip: React.FC<AppointmentProps> = ({ data }) => {
  const { movieId } = data.appointmentData;

  const movieData = useMemo(
    () => getMovieById(movieId),
    [movieId],
  );

  return (
    <div className="movie-info">
      <div className="movie-preview-image">
        <img src={movieData.image} alt={`${movieData.text} poster`} />
      </div>
      <div className="movie-details">
        <div className="title">
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
