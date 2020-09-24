import React from 'react';
import Diagram, { CustomShape, Nodes, AutoLayout } from 'devextreme-react/diagram';
import { Popup } from 'devextreme-react/popup';
import ArrayStore from 'devextreme/data/array_store';
import CustomShapeTemplate from './CustomShapeTemplate.js';
import service from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.employees = service.getEmployees();
    this.dataSource = new ArrayStore({
      key: 'ID',
      data: this.employees
    });

    this.state = {
      currentEmployee: {},
      popupVisible: false
    };

    this.customShapeTemplate = this.customShapeTemplate.bind(this);
    this.showInfo = this.showInfo.bind(this);
    this.hideInfo = this.hideInfo.bind(this);
  }
  itemTypeExpr(obj) {
    return `employee${obj.ID}`;
  }
  customShapeTemplate(item) {
    return CustomShapeTemplate(item.dataItem, function() { this.showInfo(item.dataItem); }.bind(this));
  }
  showInfo(employee) {
    this.setState({
      currentEmployee: employee,
      popupVisible: true
    });
  }
  hideInfo() {
    this.setState({
      currentEmployee: {},
      popupVisible: false
    });
  }

  render() {
    return (
      <div id="container">
        <Diagram id="diagram" customShapeRender={this.customShapeTemplate} readOnly={true}>
          {this.employees.map(function(employee, index) {
            return <CustomShape type={`employee${employee.ID}`} baseType="rectangle"
              defaultWidth={1.5} defaultHeight={1} allowEditText={false} allowResize={false} key={index} />;
          })}
          <Nodes dataSource={this.dataSource} keyExpr="ID" typeExpr={this.itemTypeExpr} parentKeyExpr="Head_ID">
            <AutoLayout type="tree" />
          </Nodes>
        </Diagram>
        <Popup
          visible={this.state.popupVisible}
          onHiding={this.hideInfo}
          dragEnabled={false}
          closeOnOutsideClick={true}
          showTitle={true}
          title="Information"
          width={300}
          height={280}
        >
          <p>Full Name: <b>{this.state.currentEmployee.Full_Name}</b></p>
          <p>Title: <b>{this.state.currentEmployee.Title}</b></p>
          <p>City: <b>{this.state.currentEmployee.City}</b></p>
          <p>State: <b>{this.state.currentEmployee.State}</b></p>
          <p>Email: <b>{this.state.currentEmployee.Email}</b></p>
          <p>Skype: <b>{this.state.currentEmployee.Skype}</b></p>
          <p>Mobile Phone: <b>{this.state.currentEmployee.Mobile_Phone}</b></p>
        </Popup>
      </div>
    );
  }
}

export default App;
