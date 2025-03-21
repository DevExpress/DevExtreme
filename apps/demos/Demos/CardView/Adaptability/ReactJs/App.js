import React, { useState } from "react";
import "devextreme/dist/css/dx.fluent.blue.light.css";
import { CardView, Paging } from "devextreme-react/card-view";
import { employees } from "./data";

const App = () => {
  const [cardsPerRow, setCardsPerRow] = useState(3);

  const calculateFullName = (data) => `${data.FirstName} ${data.LastName}`;
  const imageExpr = (data) => `https://js.devexpress.com/jQuery/Demos/WidgetsGallery/JSDemos/${data.Picture}`;

  return (
    <div>
      <SelectBox items={[1, 2, 3, 4, 8]} value={cardsPerRow} onValueChanged={(e) => setCardsPerRow(e.value)} />
      <CardView
        id="cardview"
        dataSource={employees}
        keyExpr="ID"
        columns={[
          { dataField: "Full Name", calculateCellValue: calculateFullName },
          { dataField: "Prefix" },
          { dataField: "Position" },
          { dataField: "BirthDate" },
          { dataField: "HireDate" },
          { dataField: "Address" },
        ]}
        cardCover={{ imageExpr, altExpr: "FullName" }}
        pager={{
          allowedPageSizes: [5, 8, 15, 30],
          showInfo: true,
          showNavigationButtons: true,
          showPageSizeSelector: true,
          visible: true,
        }}
        cardsPerRow={cardsPerRow}
      >
        <Paging pageSize={5} />
      </CardView>
    </div>
  );
};

export default App;
