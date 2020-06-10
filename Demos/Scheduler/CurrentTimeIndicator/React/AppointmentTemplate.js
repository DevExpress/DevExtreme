import React from 'react';
import Query from 'devextreme/data/query';

import { moviesData } from './data.js';

function getMovieById(id) {
  return Query(moviesData).filter(['id', id]).toArray()[0];
}

export default function AppointmentTemplate(model) {
  const movieInfo = getMovieById(model.appointmentData.movieId) || {};
  return (
    <div className="movie">
      <img src={movieInfo.image} />
      <div className="movie-text">{movieInfo.text}</div>
    </div>
  );
}
