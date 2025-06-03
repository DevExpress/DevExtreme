import React, { useCallback, useState } from 'react';
import Button from 'devextreme-react/button';
import { VehicleCardProps } from './types';

const VehicleCard = ({ vehicle: { 
    ID,
    TrademarkName,
    Name,
    Price,
    CategoryName,
    Modification,
    BodyStyleName,
    Horsepower,
   }, vehicle, onShowInfo }: VehicleCardProps) => {
  return (
    <div className="vehicle__card">
        <div className="vehicle__img-wrapper">
            <img className="vehicle__img"
                src={`../../../../images/vehicles/image_${ID}.png`}
                alt={`${TrademarkName} ${Name}`}
            />
        </div>
        <div className="vehicle__info">
            <div className="vehicle__name" title={`${TrademarkName} ${Name}`}>
                {TrademarkName} {Name}
            </div>
            <div className="vehicle__price">
                ${Price}
            </div>
            <div className="vehicle__type-container">
                <div className="vehicle__type">
                    {CategoryName}
                </div>
            </div>
            <div className="vehicle__spec-container">
                <div className="vehicle__modification">
                    {Modification}
                </div>
                <div className="vehicle__modification">
                    {BodyStyleName}
                </div>
                <div className="vehicle__modification">
                     {Horsepower} h.p.
                </div>
            </div>
            <div className="vehicle__footer-container">
                <Button
                    text="Image Info"
                    type="default"
                    width="100%"
                    onClick={() => onShowInfo(vehicle)}
                >
                </Button>
            </div>
        </div>
    </div>
  );
};

export default VehicleCard;
