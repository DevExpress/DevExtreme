import React, { useCallback, useState } from 'react';
import notify from 'devextreme/ui/notify';
import Button from 'devextreme-react/button';
import Popup from 'devextreme-react/popup';
import { housesSource } from './data.js';
import { House } from './House.js';

const ADD_TO_FAVORITES = 'Add to Favorites';
const REMOVE_FROM_FAVORITES = 'Remove from Favorites';
const formatCurrency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
}).format;
const favButtonAttrs = {
  class: 'favorites',
};
export default function App() {
  const [houses, setHouses] = useState(housesSource);
  const [currentHouse, setCurrentHouse] = useState(housesSource[0]);
  const [popupVisible, setPopupVisible] = useState(false);
  const changeFavoriteState = useCallback(() => {
    const updatedHouses = [...houses];
    const updatedCurrentHouse = updatedHouses.find((house) => house === currentHouse);
    updatedCurrentHouse.Favorite = !updatedCurrentHouse.Favorite;
    setHouses(updatedHouses);
    notify(
      {
        message: `This item has been ${
          updatedCurrentHouse.Favorite ? 'added to' : 'removed from'
        } the Favorites list!`,
        width: 450,
      },
      updatedCurrentHouse.Favorite ? 'success' : 'error',
      2000,
    );
  }, [houses, currentHouse, setHouses]);
  const renderPopup = useCallback(
    () => (
      <div className="popup-property-details">
        <div className="large-text">{formatCurrency(currentHouse.Price)}</div>
        <div className="opacity">
          {currentHouse.Address}, {currentHouse.City}, {currentHouse.State}
        </div>
        <Button
          icon="favorites"
          text={currentHouse.Favorite ? REMOVE_FROM_FAVORITES : ADD_TO_FAVORITES}
          width={260}
          height={44}
          elementAttr={favButtonAttrs}
          onClick={changeFavoriteState}
        />
        <div className="images">
          <img
            alt={currentHouse.Address}
            src={currentHouse.Image}
          />
          <img
            alt={currentHouse.Address}
            src={currentHouse.Image.replace('.jpg', 'b.jpg')}
          />
        </div>
        <div>{currentHouse.Features}</div>
      </div>
    ),
    [currentHouse, changeFavoriteState],
  );
  const showHouse = useCallback(
    (house) => {
      setCurrentHouse(house);
      setPopupVisible(true);
    },
    [setCurrentHouse, setPopupVisible],
  );
  const handlePopupHidden = useCallback(() => {
    setPopupVisible(false);
  }, [setPopupVisible]);
  return (
    <div className="images">
      {houses.map((h) => (
        <House
          house={h}
          show={showHouse}
          key={h.ID}
        />
      ))}
      <Popup
        width={660}
        height={540}
        showTitle={true}
        title={currentHouse.Address}
        dragEnabled={false}
        hideOnOutsideClick={true}
        visible={popupVisible}
        onHiding={handlePopupHidden}
        contentRender={renderPopup}
        showCloseButton={true}
      />
    </div>
  );
}
