import React, { useCallback, useState } from 'react';
import DataGrid, {
  Column,
  GroupPanel,
} from 'devextreme-react/data-grid';
import Popup, { Position } from 'devextreme-react/popup';
import { vehicles, aiIntegration } from './data.ts';
import Trademark from './Trademark.tsx';
import Category from './Category.tsx';
import LicenseInfo from './LicenseInfo.tsx';
import { Vehicle } from './types.ts';

const gridConfig = {
  paging: { pageSize: 10 },
  grouping: { contextMenuEnabled: false },
  ai: {
    prompt: 'Identify the country where this vehicle model is originally manufactured or developed, based on its brand, model, and specifications.',
    mode: 'auto' as const,
  },
};

export default function App() {
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);

  const showInfo = useCallback((vehicle: Vehicle) => {
    setCurrentVehicle(vehicle);
  }, []);

  const hideInfo = useCallback(() => {
    setCurrentVehicle(null);
  }, []);

  const cellRender = useCallback((vehicle: { data: Vehicle }) => (
    <Trademark vehicle={vehicle.data} onShowInfo={showInfo} />
  ), [showInfo]);

  return (
    <React.Fragment>
      <DataGrid
        dataSource={vehicles}
        keyExpr="ID"
        paging={gridConfig.paging}
        grouping={gridConfig.grouping}
        aiIntegration={aiIntegration}
      >
        <GroupPanel visible={false} />
        <Column
          caption="Trademark"
          width={220}
          dataField='TrademarkName'
          cellRender={cellRender}
        />
        <Column
          dataField="Price"
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
          ai={gridConfig.ai}
          width={200}
          fixed={true}
          fixedPosition="right"
          cssClass="ai__cell"
        />
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
          currentVehicle ? <LicenseInfo vehicle={currentVehicle} /> : null
        }
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
