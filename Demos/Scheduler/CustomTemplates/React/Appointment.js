import React from 'react';
import Query from 'devextreme/data/query';
import localization from 'devextreme/localization';
import { moviesData } from './data.js';

function getMovieById(id) {
  return Query(moviesData).filter(['id', id]).toArray()[0];
}

export default function Appointment(model) {
  const { targetedAppointmentData } = model.data;

  const movieData = getMovieById(targetedAppointmentData.movieId) || {};

  return (
    <div className="showtime-preview">
      <div> {movieData.text}</div>
      <div>
        Ticket Price: <strong>${ targetedAppointmentData.price }</strong>
      </div>
      <div>
        {localization.formatDate(targetedAppointmentData.displayStartDate, 'shortTime')}
        {' - '}
        {localization.formatDate(targetedAppointmentData.displayEndDate, 'shortTime')}
      </div>
    </div>
  );
}
