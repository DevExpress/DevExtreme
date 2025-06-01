import React, { useCallback, useState } from 'react';
import CardView, { Column } from 'devextreme-react/card-view';
import Popup, { Position } from 'devextreme-react/popup';
import { Vehicle, vehicles } from './data.ts';
import VehicleCard from './VehicleCard.tsx';
import LicenseInfo from './LicenseInfo.tsx';

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
        cardsPerRow="auto"
        cardMinWidth={260}
        cardMaxWidth={260}
        searchPanel={{ visible: true }}
        paging={{ pageSize: 12 }}
        headerFilter={{ visible: true }}
        cardRender={(model) => {
          return <VehicleCard vehicle={model.card.data} onShowInfo={showInfo} />
        }}
      >
        <Column dataField="TrademarkName" />
        <Column dataField="Name" />
        <Column
          dataField="Price"
          format="currency"
        />
        <Column dataField="CategoryName" />
        <Column dataField="Modification" />
        <Column dataField="BodyStyleName" />
        <Column dataField="Horsepower" />
      </CardView>

      <Popup
        width={350}
        height={190}
        visible={popupVisible}
        dragEnabled={false}
        hideOnOutsideClick={true}
        showCloseButton={false}
        showTitle={false}
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
