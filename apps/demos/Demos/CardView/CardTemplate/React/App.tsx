import React, { useCallback, useState } from 'react';
import CardView, { Column, HeaderFilter, SearchPanel, Paging } from 'devextreme-react/card-view';
import Popup, { Position } from 'devextreme-react/popup';
import { Vehicle, vehicles } from './data.ts';
import VehicleCard from './VehicleCard.tsx';
import LicenseInfo from './LicenseInfo.tsx';

const getFormattedPrice = (card: any): string => {
  const priceText = card.fields.find(f => f?.column?.dataField === 'Price');
  return priceText?.text ?? '';
};

const App = () => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);

  const showInfo = useCallback((vehicle: Vehicle) => {
    setCurrentVehicle(vehicle);
    setPopupVisible(true);
  }, []);

  const hideInfo = useCallback(() => {
    setPopupVisible(false);
  }, []);

  return (
    <>
      <CardView
        dataSource={vehicles}
        height={1120}
        cardsPerRow="auto"
        cardMinWidth={240}
        cardRender={(model) => {
          const vehicle = model.card.data;
          return <VehicleCard
            vehicle={vehicle}
            id={vehicle.ID}
            model={`${vehicle.TrademarkName} ${vehicle.Name}`}
            price={getFormattedPrice(model.card)}
            categoryName={vehicle.CategoryName}
            modification={vehicle.Modification}
            bodyStyleName={vehicle.BodyStyleName}
            horsepower={vehicle.Horsepower}
            onShowInfo={showInfo}
          />;
        }}
      >
        <HeaderFilter visible={true} />
        <SearchPanel visible={true} />
        <Paging pageSize={12} />

        <Column
          dataField="TrademarkName"
          caption="Trademark"
        />
        <Column
          dataField="Name"
          caption="Model"
        />
        <Column
          dataField="Price"
          format="currency"
        >
          <HeaderFilter groupInterval={20000} />
        </Column>
        <Column
          dataField="CategoryName"
          caption="Category"
        />
        <Column dataField="Modification" />
        <Column
          dataField="BodyStyleName"
          caption="Body Style"
        />
        <Column dataField="Horsepower" />
      </CardView>

      <Popup
        width={360}
        height={260}
        visible={popupVisible}
        dragEnabled={false}
        hideOnOutsideClick={true}
        title="Image Info"
        onHiding={hideInfo}
        contentRender={() =>
          currentVehicle ? <LicenseInfo vehicle={currentVehicle} /> : null
        }
      >
        <Position at="center" my="center" collision="fit" />
      </Popup>
    </>
  );
};

export default App;
