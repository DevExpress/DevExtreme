import React, { useCallback, useState } from 'react';

import DataGrid, {
  Column,
  Paging,
  Grouping,
  AI,
} from 'devextreme-react/data-grid';
import type { DataGridTypes } from 'devextreme-react/data-grid';
import Popup, { Position } from 'devextreme-react/popup';

import { vehicles } from './data.ts';
import { aiIntegration } from './service.ts';
import Category from './Category.tsx';
import LicenseInfo from './LicenseInfo.tsx';
import Trademark from './Trademark.tsx';
import type { Vehicle } from './types.ts';

const onAIColumnRequestCreating = (e: DataGridTypes.AIColumnRequestCreatingEvent) => {
  e.data = e.data.map((item: Vehicle) => ({
    ID: item.ID,
    TrademarkName: item.TrademarkName,
    Name: item.Name,
    Modification: item.Modification,
  }));
};

export default function App() {
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);

  const showInfo = useCallback((vehicle: Vehicle) => {
    setCurrentVehicle(vehicle);
  }, []);

  const hideInfo = useCallback(() => {
    setCurrentVehicle(null);
  }, []);

  return (
    <>
      <DataGrid
        dataSource={vehicles}
        showBorders={true}
        keyExpr="ID"
        aiIntegration={aiIntegration}
        onAIColumnRequestCreating={onAIColumnRequestCreating}
        className="ai__grid"
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
          cellRender={(cellData) =>
            <Trademark
              vehicle={cellData.data}
              onShowInfo={showInfo}
            />
          }
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
        >
          <AI
            mode="auto"
            noDataText="No data"
            prompt="Identify the country where the vehicle model is manufactured. When looking up a country, consider vehicle brand, model, and specifications."
          />
        </Column>
      </DataGrid>
      <Popup
        width={360}
        height={260}
        visible={Boolean(currentVehicle)}
        dragEnabled={false}
        hideOnOutsideClick={true}
        title="Image Info"
        onHiding={hideInfo}
        contentRender={() =>
          <LicenseInfo vehicle={currentVehicle} />
        }
      >
        <Position
          at="center"
          my="center"
          collision="fit"
        />
      </Popup>
    </>
  );
}
