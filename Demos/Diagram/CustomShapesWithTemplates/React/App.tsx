import React from 'react';
import Diagram, { CustomShape, Nodes, AutoLayout } from 'devextreme-react/diagram';
import { Popup } from 'devextreme-react/popup';
import ArrayStore from 'devextreme/data/array_store';
import CustomShapeTemplate from './CustomShapeTemplate.tsx';
import service, { Employee as EmployeeType } from './data.ts';

const employees = service.getEmployees();
const dataSource = new ArrayStore({
  key: 'ID',
  data: employees,
});

function itemTypeExpr(obj: { ID: number; }) {
  return `employee${obj.ID}`;
}

export default function App() {
  const [currentEmployee, setCurrentEmployee] = React.useState<Partial<EmployeeType>>({});
  const [popupVisible, setPopupVisible] = React.useState(false);

  const showInfo = React.useCallback((employee) => {
    setCurrentEmployee(employee);
    setPopupVisible(true);
  }, [setCurrentEmployee, setPopupVisible]);

  const hideInfo = React.useCallback(() => {
    setCurrentEmployee({});
    setPopupVisible(false);
  }, [setCurrentEmployee, setPopupVisible]);

  const customShapeTemplate = React.useCallback((item) => (CustomShapeTemplate(item.dataItem,
    () => { showInfo(item.dataItem); })), [showInfo]);

  return (
    <div id="container">
      <Diagram id="diagram" customShapeRender={customShapeTemplate} readOnly={true}>
        {employees.map((employee, index) => <CustomShape
          type={`employee${employee.ID}`}
          baseType="rectangle"
          defaultWidth={1.5}
          defaultHeight={1}
          allowEditText={false}
          allowResize={false}
          key={index} />)}
        <Nodes dataSource={dataSource} keyExpr="ID" typeExpr={itemTypeExpr} parentKeyExpr="Head_ID">
          <AutoLayout type="tree" />
        </Nodes>
      </Diagram>
      <Popup
        visible={popupVisible}
        onHiding={hideInfo}
        dragEnabled={false}
        hideOnOutsideClick={true}
        showTitle={true}
        title="Information"
        width={300}
        height={280}
      >
        <p>Full Name: <b>{currentEmployee.Full_Name}</b></p>
        <p>Title: <b>{currentEmployee.Title}</b></p>
        <p>City: <b>{currentEmployee.City}</b></p>
        <p>State: <b>{currentEmployee.State}</b></p>
        <p>Email: <b>{currentEmployee.Email}</b></p>
        <p>Skype: <b>{currentEmployee.Skype}</b></p>
        <p>Mobile Phone: <b>{currentEmployee.Mobile_Phone}</b></p>
      </Popup>
    </div>
  );
}
