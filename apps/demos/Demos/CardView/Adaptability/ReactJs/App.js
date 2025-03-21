import React from "react";
import "devextreme/dist/css/dx.fluent.blue.light.css";
import { CardView, Paging } from "devextreme-react/card-view";
import { employees } from "./data";

const App = () => {
  const calculateFullName = (data) => `${data.FirstName} ${data.LastName}`;
  const imageExpr = (data) => `https://js.devexpress.com/jQuery/Demos/WidgetsGallery/JSDemos/${data.Picture}`;

  return (
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
        { dataField: "Address" }
      ]}
      cardCover={{ imageExpr, altExpr: "FullName" }}
      pager={{
        allowedPageSizes: [5, 8, 15, 30],
        showInfo: true,
        showNavigationButtons: true,
        showPageSizeSelector: true,
        visible: true
      }}
    >
      <Paging pageSize={5} />
    </CardView>
  );
};

export default App;
