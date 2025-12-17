import React, { useCallback, useState } from 'react';

import CardView, { Column, HeaderFilter, SearchPanel, Paging } from 'devextreme-react/card-view';
import type { CardViewTypes } from 'devextreme-react/card-view';
import Popup, { Position } from 'devextreme-react/popup';

import { vehicles } from './data.ts';
import type { Vehicle } from './types.ts';
import LicenseInfo from './LicenseInfo.tsx';
import VehicleCard from './VehicleCard.tsx';

const getFormattedPrice = (card: CardViewTypes.CardInfo): string => {
  const priceText = card.fields?.find((f: CardViewTypes.FieldInfo) => f?.column?.dataField === 'Price');
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

  const cardRender = useCallback((model: CardViewTypes.CardTemplateData) => {
    const vehicle = model.card.data as Vehicle;
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
  }, [showInfo]);

  const contentRender = useCallback(() => (
    currentVehicle ? <LicenseInfo vehicle={currentVehicle} /> : null
  ), [currentVehicle]);

  return (
    <>
      <CardView
        dataSource={vehicles}
        height={1120}
        cardsPerRow="auto"
        cardMinWidth={240}
        cardRender={cardRender}
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
        contentRender={contentRender}
      >
        <Position at="center" my="center" collision="fit" />
      </Popup>
    </>
  );
};

export default App;
