import React, { useMemo } from 'react';
import { query as Query } from 'devextreme-react/common/data';
import { formatDate } from 'devextreme-react/common/core/localization';
import { moviesData } from './data.js';

const getMovieById = (id) => Query(moviesData).filter(['id', id]).toArray()[0];
const Appointment = (props) => {
  const { targetedAppointmentData } = props.data;
  const {
    movieId, price, displayStartDate, displayEndDate,
  } = targetedAppointmentData;
  const movieData = useMemo(() => getMovieById(movieId), [movieId]);
  return (
    <div className="movie-preview">
      <div className="movie-preview-image">
        <img
          src={movieData.image}
          alt={`${movieData.text} poster`}
        />
      </div>
      <div className="movie-details">
        <div className="title">{movieData.text}</div>
        <div>
          Ticket Price: <b>${price}</b>
        </div>
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
