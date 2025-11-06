import React, { FC } from 'react';
import 'devextreme-react/date-range-box';

import { BookingFormData } from './types.ts';

interface ConfirmationProps {
  formData: BookingFormData;
  isConfirmed: boolean;
}

const Confirmation: FC<ConfirmationProps> = ({ formData, isConfirmed }) => {
  if (isConfirmed) {
    return (
      <div className="summary-item-header center">
        Your booking request was submitted.
      </div>
    );
  }

  return (
    <div className="summary-container">
      <div className="summary-item">
        <div className="summary-item-header">Dates</div>
        <div className="separator"></div>
        <div>
          <span className="summary-item-label">Check-in Date: </span>{new Date(formData.dates[0]).toLocaleDateString()}
        </div>
        <div>
          <span className="summary-item-label">Check-out Date: </span>{new Date(formData.dates[1]).toLocaleDateString()}
        </div>
      </div>

      <div className="summary-item">
        <div className="summary-item-header">Guests</div>
        <div className="separator"></div>
        <div><span className="summary-item-label">Adults: </span>{formData.adultsCount}</div>
        <div><span className="summary-item-label">Children: </span>{formData.childrenCount}</div>
        <div><span className="summary-item-label">Pets: </span>{formData.petsCount}</div>
      </div>

      <div className="summary-item">
        <div className="summary-item-header">Room and Meals</div>
        <div className="separator"></div>
        <div><span className="summary-item-label">Room Type: </span>{formData.roomType}</div>
        <div><span className="summary-item-label">Check-out Date: </span>{formData.mealPlan}</div>
      </div>

      {!!formData.additionalRequest && (
        <div className="summary-item">
          <div className="summary-item-header">Additional Requests</div>
          <div className="separator"></div>
          <div>{formData.additionalRequest}</div>
        </div>
      )}
    </div>
  );
};

Confirmation.displayName = 'Confirmation';

export default Confirmation;
