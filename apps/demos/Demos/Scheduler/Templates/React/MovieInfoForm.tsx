import React, { useState, useEffect } from 'react';
import type dxForm from 'devextreme/ui/form';
import type { FieldDataChangedEvent } from 'devextreme/ui/form';
import { query } from 'devextreme-react/common/data';
import { moviesData, type MovieResource } from './data.ts';

type MovieInfoFormProps = {
  formInstanceRef: React.RefObject<dxForm | null>;
};

const getMovieById = (id: number) => query(moviesData).filter(['id', id]).toArray()[0];

const MovieInfoForm: React.FC<MovieInfoFormProps> = ({ formInstanceRef }) => {
  const [movie, setMovie] = useState<MovieResource | null>(null);

  useEffect(() => {
    const form = formInstanceRef.current;

    if (form) {
      const formData = form.option('formData');
      if (formData?.movieId) {
        const currentMovie = getMovieById(formData.movieId);
        setMovie(currentMovie);
      } else {
        setMovie(null);
      }

      const handleFieldDataChanged = (e: FieldDataChangedEvent) => {
        if (e.dataField === 'movieId') {
          if (e.value) {
            const updatedMovie = getMovieById(e.value);
            setMovie(updatedMovie);
          } else {
            setMovie(null);
          }
        }
      };

      form.on('fieldDataChanged', handleFieldDataChanged);

      return () => {
        form.off('fieldDataChanged', handleFieldDataChanged);
      };
    }

    return undefined;
  }, [formInstanceRef]);

  return (
    <div className="movie-info-container">
      {movie ? (
        <div className="movie-info">
          <div className="movie-preview-image">
            <img src={movie.image} alt={movie.text} />
          </div>
          <div className="movie-details">
            <div className="title">{movie.text} ({movie.year})</div>
            <div>Director: {movie.director}</div>
            <div>Duration: {movie.duration} minutes</div>
          </div>
        </div>
      ) : (
        <div className="movie-info">
          <div className="movie-preview-image" />
          <div className="movie-details">
            <div className="title">Select a movie</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieInfoForm;
