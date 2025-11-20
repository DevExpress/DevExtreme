import React, { useCallback, useState } from 'react';
import DataGrid, { Column, Paging, Grouping } from 'devextreme-react/data-grid';
import Popup, { Position } from 'devextreme-react/popup';
import { vehicles } from './data.js';
import { aiIntegration } from './service.js';
import Trademark from './Trademark.js';
import Category from './Category.js';
import LicenseInfo from './LicenseInfo.js';

const aiConfig = {
  mode: 'auto',
  noDataText: 'No data',
  prompt:
    'Identify the country where this vehicle model is originally manufactured or developed, based on its brand, model, and specifications.',
};
const onAIColumnRequestCreating = (e) => {
  e.data = e.data.map((item) => ({
    ID: item.ID,
    TrademarkName: item.TrademarkName,
    Name: item.Name,
    Modification: item.Modification,
  }));
};
export default function App() {
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const showInfo = useCallback((vehicle) => {
    setCurrentVehicle(vehicle);
  }, []);
  const hideInfo = useCallback(() => {
    setCurrentVehicle(null);
  }, []);
  return (
    <React.Fragment>
      <DataGrid
        dataSource={vehicles}
        showBorders={true}
        keyExpr="ID"
        aiIntegration={aiIntegration}
        onAIColumnRequestCreating={onAIColumnRequestCreating}
      >
        <Paging
          enabled={true}
          pageSize={10}
        />
        <Grouping contextMenuEnabled={false} />
        <Column
          caption="Trademark"
          width={200}
          dataField="TrademarkName"
          cellRender={(cellData) => (
            <Trademark
              vehicle={cellData.data}
              onShowInfo={showInfo}
            />
          )}
        />
        <Column
          dataField="Price"
          alignment="left"
          format="currency"
          width={100}
        />
        <Column
          caption="Category"
          minWidth={180}
          cellRender={Category}
        />
        <Column
          dataField="Modification"
          width={180}
        />
        <Column
          dataField="Horsepower"
          width={140}
        />
        <Column
          dataField="BodyStyleName"
          caption="Body Style"
          width={180}
        />
        <Column
          name="AI Column"
          caption="AI Column"
          type="ai"
          width={200}
          fixed={true}
          fixedPosition="right"
          cssClass="ai__cell"
          ai={aiConfig}
        ></Column>
      </DataGrid>
      <Popup
        width={360}
        height={260}
        visible={Boolean(currentVehicle)}
        dragEnabled={false}
        hideOnOutsideClick={true}
        title="Image Info"
        onHiding={hideInfo}
        contentRender={() => <LicenseInfo vehicle={currentVehicle} />}
      >
        <Position
          at="center"
          my="center"
          collision="fit"
        />
      </Popup>
    </React.Fragment>
  );
}
