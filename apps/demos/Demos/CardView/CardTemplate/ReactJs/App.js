import React, { useCallback, useState } from 'react';
import CardView, {
  Column, HeaderFilter, SearchPanel, Paging,
} from 'devextreme-react/card-view';
import Popup, { Position } from 'devextreme-react/popup';
import { vehicles } from './data.js';
import VehicleCard from './VehicleCard.js';
import LicenseInfo from './LicenseInfo.js';

const App = () => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const showInfo = useCallback((vehicle) => {
    setCurrentVehicle(vehicle);
    setPopupVisible(true);
  }, []);
  const hideInfo = useCallback(() => {
    setPopupVisible(false);
  }, []);
  const getFormattedPrice = useCallback((card) => {
    const priceText = card.fields.find((f) => f?.column?.dataField === 'Price');
    return priceText?.text ?? '';
  }, []);
  return (
    <React.Fragment>
      <CardView
        dataSource={vehicles}
        cardsPerRow="auto"
        cardMinWidth={260}
        cardRender={(model) => {
          const vehicle = model.card.data;
          return (
            <VehicleCard
              vehicle={vehicle}
              id={vehicle.ID}
              model={`${vehicle.TrademarkName} ${vehicle.Name}`}
              price={getFormattedPrice(model.card)}
              categoryName={vehicle.CategoryName}
              modification={vehicle.Modification}
              bodyStyleName={vehicle.BodyStyleName}
              horsepower={vehicle.Horsepower}
              onShowInfo={showInfo}
            />
          );
        }}
      >
        <HeaderFilter visible={true} />
        <SearchPanel visible={true} />
        <Paging pageSize={12} />

        <Column dataField="TrademarkName" />
        <Column dataField="Name" />
        <Column
          dataField="Price"
          format="currency"
        >
          <HeaderFilter groupInterval={20000} />
        </Column>
        <Column dataField="CategoryName" />
        <Column dataField="Modification" />
        <Column dataField="BodyStyleName" />
        <Column dataField="Horsepower" />
      </CardView>

      <Popup
        width={350}
        height={240}
        visible={popupVisible}
        dragEnabled={false}
        hideOnOutsideClick={true}
        title="Image Info"
        onHiding={hideInfo}
        contentRender={() => (currentVehicle ? <LicenseInfo vehicle={currentVehicle} /> : null)}
      >
        <Position
          at="center"
          my="center"
          collision="fit"
        />
      </Popup>
    </React.Fragment>
  );
};
export default App;
