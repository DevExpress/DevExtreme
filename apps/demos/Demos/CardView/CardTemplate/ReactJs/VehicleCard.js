import React, { useCallback, useState } from 'react';
import Button from 'devextreme-react/button';
import Popup, { Position } from 'devextreme-react/popup';
import LicenseInfo from './LicenseInfo.js';

const VehicleCard = ({ vehicle }) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const hideInfo = useCallback(() => {
    setPopupVisible(false);
  }, [setPopupVisible]);
  return (
    <div className="vehicle__card">
      <div className="vehicle__img-wrapper">
        <img
          className="vehicle__img"
          src={`../../../../images/vehicles/image_${vehicle.ID}.png`}
          alt={`${vehicle.TrademarkName} ${vehicle.Name}`}
        />
      </div>
      <div className="vehicle__info">
        <div
          className="vehicle__name"
          title={`${vehicle.TrademarkName} ${vehicle.Name}`}
        >
          {vehicle.TrademarkName} {vehicle.Name}
        </div>
        <div className="vehicle__price">${vehicle.Price}</div>
        <div className="vehicle__type-container">
          <div className="vehicle__type">{vehicle.CategoryName}</div>
        </div>
        <div className="vehicle__spec-container">
          <div className="vehicle__modification">{vehicle.Modification}</div>
          <div className="vehicle__modification">
            {vehicle.BodyStyleName} {vehicle.Horsepower} h.p.
          </div>
        </div>
        <div className="vehicle__footer-container">
          <Button
            text="Image Info"
            type="default"
            width="100%"
            onClick={() => setPopupVisible(true)}
          ></Button>
          <Popup
            width={350}
            height={190}
            visible={popupVisible}
            dragEnabled={false}
            hideOnOutsideClick={true}
            showCloseButton={false}
            showTitle={false}
            onHiding={hideInfo}
            contentRender={() => <LicenseInfo vehicle={vehicle}></LicenseInfo>}
          >
            <Position
              at="center"
              my="center"
              collision="fit"
            />
          </Popup>
        </div>
      </div>
    </div>
  );
};
export default VehicleCard;
