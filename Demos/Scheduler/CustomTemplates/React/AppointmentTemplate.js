import React from 'react';
import Query from 'devextreme/data/query';
import 'devextreme/localization/globalize/date';

import Globalize from 'globalize';
import { moviesData } from './data.js';

function getMovieById(id) {
  return Query(moviesData).filter(['id', id]).toArray()[0];
}

export default function AppointmentTemplate(model) {
  const movieData = getMovieById(model.appointmentData.movieId) || {};
  return (
    <div className="showtime-preview">
      <div> {movieData.text}</div>
      <div>
        Ticket Price: <strong>${ model.appointmentData.price }</strong>
      </div>
      <div>
        {Globalize.formatDate(model.appointmentData.startDate, { time: 'short' })}
        {' - '}
        {Globalize.formatDate(model.appointmentData.endDate, { time: 'short' }) }
      </div>
    </div>
  );
}
