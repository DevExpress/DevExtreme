import React from 'react';

const LicenseInfo = ({ vehicle }) => {
  if (!vehicle) {
    return null;
  }
  const {
    LicenseName, Author, Source, Edits,
  } = vehicle;
  const vehicleLink = `https://${Source}`;
  return (
    <div>
      <p>
        <b>Image licensed under: </b> <span>{LicenseName}</span>
      </p>
      <p>
        <b>Author: </b> <span>{Author}</span>
      </p>
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
      <p>
        <b>Edits: </b> <span>{Edits}</span>
      </p>
    </div>
  );
};
export default LicenseInfo;
