import React from 'react';
import DataGrid, {
  Column,
  GroupPanel,
} from 'devextreme-react/data-grid';
import Popup, { Position } from 'devextreme-react/popup';
import { vehicles, aiIntegration } from './data.ts';
import Trademark from './Trademark.tsx';
import Category from './Category.tsx';

export default function App() {
  return (
    <>
      <DataGrid 
        dataSource={vehicles} 
        keyExpr={'ID'} 
        paging={{ pageSize: 10 }}
        grouping={{ contextMenuEnabled: false }}
        aiIntegration={aiIntegration}
      >
        <GroupPanel visible={false} />
        <Column caption="Trademark" width={220} cellRender={Trademark} 
        />
        <Column dataField="Price" format="currency" width={100} />
        <Column caption="Category" minWidth={180} cellRender={Category} />
        <Column dataField="Modification" width={180} />
        <Column dataField="Horsepower" width={140} />
        <Column dataField="BodyStyleName" caption="Body Style" width={180} />
        <Column 
          name="AI Column" 
          caption="AI Column" 
          type="ai"
          // @ts-ignore
          // ai={{
          //   prompt: "Identify the country where this vehicle model is originally manufactured or developed, based on its brand, model, and specifications.",
          //   mode: "auto",
          // }} 
          width={200}
          fixed={true}
          fixedPosition="right"
          cssClass="ai__cell"
        />
      </DataGrid>
    </>
  );
}