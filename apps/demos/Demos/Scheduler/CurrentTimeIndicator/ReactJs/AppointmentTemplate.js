import React from 'react';
import Query from 'devextreme/data/query';
import { moviesData } from './data.js';

const getMovieById = (id) => Query(moviesData).filter(['id', id]).toArray()[0];
const AppointmentTemplate = (props) => {
  const { appointmentData } = props.data;
  const movieInfo = getMovieById(appointmentData.movieId) || {};
  return (
    <div className="movie">
      <img src={movieInfo.image} />
      <div className="movie-text">{movieInfo.text}</div>
    </div>
  );
};
export default AppointmentTemplate;
