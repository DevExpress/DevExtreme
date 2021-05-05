import React from 'react';
import Query from 'devextreme/data/query';
import { moviesData } from './data.js';
import localization from 'devextreme/localization';

function getMovieById(id) {
  return Query(moviesData).filter(['id', id]).toArray()[0];
}

export default function Appointment(model) {
  const { appointmentData } = model.data;

  const movieData = getMovieById(appointmentData.movieId) || {};

  return (
    <div className="showtime-preview">
      <div> {movieData.text}</div>
      <div>
        Ticket Price: <strong>${ appointmentData.price }</strong>
      </div>
      <div>
        {localization.formatDate(appointmentData.startDate, 'shortTime')}
        {' - '}
        {localization.formatDate(appointmentData.endDate, 'shortTime')}
      </div>
    </div>
  );
}
