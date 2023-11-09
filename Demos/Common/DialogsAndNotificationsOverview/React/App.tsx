import React from 'react';
import notify from 'devextreme/ui/notify';
import Button from 'devextreme-react/button';
import Popup from 'devextreme-react/popup';
import { housesSource } from './data.ts';
import { House } from './House.tsx';

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
  const [currentHouse, setCurrentHouse] = React.useState(housesSource[0]);
  const [popupVisible, setPopupVisible] = React.useState(false);

  const renderPopup = React.useCallback(() => (
    <div className="popup-property-details">
      <div className="large-text">{formatCurrency(currentHouse.Price)}</div>
      <div className="opacity">{currentHouse.Address}, {currentHouse.City}, {currentHouse.State}</div>
      <Button
        icon="favorites"
        text={currentHouse.Favorite ? REMOVE_FROM_FAVORITES : ADD_TO_FAVORITES}
        width={260}
        height={44}
        elementAttr={favButtonAttrs}
        onClick={changeFavoriteState}
      />
      <div className="images">
        <img alt={currentHouse.Address} src={currentHouse.Image} />
        <img alt={currentHouse.Address} src={currentHouse.Image.replace('.jpg', 'b.jpg')} />
      </div>
      <div>{currentHouse.Features}</div>
    </div>
  ), [currentHouse]);

  const showHouse = React.useCallback((house) => {
    setCurrentHouse(house);
    setPopupVisible(true);
  }, [setCurrentHouse, setPopupVisible]);

  const handlePopupHidden = React.useCallback(() => {
    setPopupVisible(false);
  }, [setPopupVisible]);

  const changeFavoriteState = React.useCallback(() => {
    const updatedHouse = { ...currentHouse };
    updatedHouse.Favorite = !updatedHouse.Favorite;

    setCurrentHouse(updatedHouse);

    notify({
      message: `This item has been ${updatedHouse.Favorite ? 'added to' : 'removed from'} the Favorites list!`,
      width: 450,
    },
    updatedHouse.Favorite ? 'success' : 'error', 2000);
  }, [currentHouse, setCurrentHouse]);

  return (
    <div className="images">
      {
        housesSource.map((h) => <House
          house={h}
          show={showHouse}
          key={h.ID}
        />)
      }
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
      />
    </div>
  );
}
