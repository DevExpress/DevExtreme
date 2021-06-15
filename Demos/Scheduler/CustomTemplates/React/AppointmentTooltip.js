import React from 'react';
import Query from 'devextreme/data/query';
import 'devextreme/localization/globalize/date';

import { moviesData } from './data.js';

function getMovieById(id) {
  return Query(moviesData).filter(['id', id]).toArray()[0];
}

export default class AppointmentTooltip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movieData: getMovieById(props.data.appointmentData.movieId)
    };
  }

  render() {
    const { movieData } = this.state;
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
  }
}
