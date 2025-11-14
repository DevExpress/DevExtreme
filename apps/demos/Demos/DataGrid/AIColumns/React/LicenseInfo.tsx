import React from 'react';
import { type Vehicle } from './types';
import { type DataGridTypes } from 'devextreme-react/data-grid';

const LicenseInfo = (props: DataGridTypes.ColumnCellTemplateData<Vehicle>) => {

  if (!props.data) {
    return null;
  }

  const { LicenseName, Author, Source, Edits } = props.data;
  const vehicleLink = `https://${Source}`;
  return (
    <div>
      <p><b>Image licensed under: </b> <span>{LicenseName}</span></p>
      <p><b>Author: </b> <span>{Author}</span></p>
      <p>
        <b>Source link: </b>
        <a
          href={vehicleLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          {vehicleLink}
        </a>
      </p>
      <p><b>Edits: </b> <span>{Edits}</span></p>
    </div>
  );
};

export default LicenseInfo;
