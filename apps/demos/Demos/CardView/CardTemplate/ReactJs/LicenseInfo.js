import React from 'react';

const LicenseInfo = ({
  vehicle: {
    LicenseName, Author, Source, Edits,
  },
}) => (
  <div>
    <p>
      <b>Image licensed under: </b> <span>{LicenseName}</span>
    </p>
    <p>
      <b>Author: </b> <span>{Author}</span>
    </p>
    <p>
      <b>Source link: </b> <a href={`https://${Source}`}>https://{Source}</a>
    </p>
    <p>
      <b>Edits: </b> <span>{Edits}</span>
    </p>
  </div>
);
export default LicenseInfo;
