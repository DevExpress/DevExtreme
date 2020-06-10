import React from 'react';
import Query from 'devextreme/data/query';
import 'devextreme/localization/globalize/date';

import Globalize from 'globalize';
import { moviesData } from './data.js';

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
        {Globalize.formatDate(appointmentData.startDate, { time: 'short' })}
        {' - '}
        {Globalize.formatDate(appointmentData.endDate, { time: 'short' }) }
      </div>
    </div>
  );
}
