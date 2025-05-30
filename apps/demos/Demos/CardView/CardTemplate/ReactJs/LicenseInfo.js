import React from 'react';

const LicenseInfo = ({ vehicle }) => (
  <div>
    <p>
      <b>Image licensed under: </b> <span>{vehicle.LicenseName}</span>
    </p>
    <p>
      <b>Author: </b> <span>{vehicle.Author}</span>
    </p>
    <p>
      <b>Source link: </b>{' '}
      <a
        href={`http://${vehicle.Source}`}
        className="license__link"
      >
          http://{vehicle.Source}
      </a>
    </p>
    <p>
      <b>Edits: </b> <span>{vehicle.Edits}</span>
    </p>
  </div>
);
export default LicenseInfo;
