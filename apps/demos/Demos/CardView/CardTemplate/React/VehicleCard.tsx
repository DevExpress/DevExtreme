import React from 'react';
import Button from 'devextreme-react/button';
import { VehicleCardProps } from './types';

const VehicleCard = ({
  vehicle,
  id,
  model,
  price,
  categoryName,
  modification,
  bodyStyleName,
  horsepower,
  onShowInfo,
}: VehicleCardProps) => (
  <div className="vehicle__card">
    <div className="vehicle__img-wrapper">
      <img className="vehicle__img"
        src={`../../../../images/vehicles/image_${id}.png`}
        alt={model}
      />
    </div>
    <div className="vehicle__info">
      <div className="vehicle__name" title={model}>
        {model}
      </div>
      <div className="vehicle__price">
        {price}
      </div>
      <div className="vehicle__type-container">
        <div className="vehicle__type">
          {categoryName}
        </div>
      </div>
      <div className="vehicle__spec-container">
        <div className="vehicle__modification">
          {modification}
        </div>
        <div className="vehicle__modification">
          {bodyStyleName}
        </div>
        <div className="vehicle__modification">
          {horsepower} h.p.
        </div>
      </div>
      <div className="vehicle__footer-container">
        <Button
          text="Image Info"
          type="default"
          width="100%"
          onClick={() => onShowInfo(vehicle)}
        />
      </div>
    </div>
  </div>
);

export default VehicleCard;
