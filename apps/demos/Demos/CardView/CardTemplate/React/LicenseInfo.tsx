import React from 'react';

import type { VehicleImageLicenseProps } from './types.ts';

const LicenseInfo = ({
  vehicle: {
    LicenseName,
    Author,
    Source,
    Edits,
  },
}: VehicleImageLicenseProps) => {
  const vehicleLink = `https://${Source}`;

  return (
    <div>
      <p><b>Image licensed under: </b> <span>{LicenseName}</span></p>
      <p><b>Author: </b> <span>{Author}</span></p>
      <p>
        <b>Source link: </b>
        <a
          href={vehicleLink}
          target='_blank'
        >
          {vehicleLink}
        </a>
      </p>
      <p><b>Edits: </b> <span>{Edits}</span></p>
    </div>
  );
};

export default LicenseInfo;
