import React from 'react';
import Diagram, { CustomShape, Nodes, AutoLayout, ContextToolbox, Toolbox, PropertiesPanel, Group } from 'devextreme-react/diagram';
import notify from 'devextreme/ui/notify';
import ArrayStore from 'devextreme/data/array_store';
import service from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.orgItemsDataSource = new ArrayStore({
      key: 'id',
      data: service.getOrgItems()
    });
    this.onRequestOperation = this.onRequestOperation.bind(this);
    this.onRequestLayoutUpdate = this.onRequestLayoutUpdate.bind(this);
  }

  render() {
    return (
      <Diagram id="diagram" onRequestOperation={this.onRequestOperation} onRequestLayoutUpdate={this.onRequestLayoutUpdate}>
        <CustomShape category="items" type="root" baseType="octagon"
          defaultText="Development" />
        <CustomShape category="items" type="team" baseType="ellipse"
          title="Team" defaultText="Team Name" />
        <CustomShape category="items" type="employee" baseType="rectangle"
          title="Employee" defaultText="Employee Name" />
        <Nodes dataSource={this.orgItemsDataSource} textExpr="name" parentKeyExpr="parentId">
          <AutoLayout type="tree" />
        </Nodes>
        <ContextToolbox shapeIconsPerRow={2} width={100} shapes={['team', 'employee']}>
        </ContextToolbox>
        <Toolbox shapeIconsPerRow={2}>
          <Group title="Items" shapes={['team', 'employee']} />
        </Toolbox>
        <PropertiesPanel visibility="disabled">
        </PropertiesPanel>
      </Diagram>
    );
  }

  onRequestLayoutUpdate(e) {
    for(var i = 0; i < e.changes.length; i++) {
      if(e.changes[i].type === 'remove') {
        e.allowed = true;
      } else if(e.changes[i].data.parentId !== undefined && e.changes[i].data.parentId !== null) {
        e.allowed = true;
      }
    }
  }
  onRequestOperation(e) {
    var dataItem = e.args.shape && e.args.shape.dataItem;
    if(e.operation === "addShape") {
      if(e.args.shape.type !== "employee" && e.args.shape.type !== "team") {
        !e.updateUI && notify("You can add only a 'Team' or 'Employee' shape.", "warning", 1000);
        e.allowed = false;
      }
    }
    else if(e.operation === "deleteShape") {
      if(dataItem && dataItem.type === "root") {
        !e.updateUI && notify("You cannot delete the 'Development' shape.", "warning", 1000);
        e.allowed = false;
      }
      if(dataItem && dataItem.type === "team") {
        var children = service.getOrgItems().filter(function(item) {
          return item.parentId === dataItem.id;
        });
        if(children.length > 0) {
          !e.updateUI && notify("You cannot delete a 'Team' shape connected to an 'Employee' shape.", "warning", 1000);
          e.allowed = false;
        }
      }
    }
    else if(e.operation === "resizeShape") {
      if(e.args.newSize.width < 1 || e.args.newSize.height < 0.75) {
        !e.updateUI && notify("The shape size is too small.", "warning", 1000);
        e.allowed = false;
      }
    }
    else if(e.operation === "changeConnection") {
      if(dataItem && dataItem.type === "root" && e.args.connectorPosition === "end") {
        !e.updateUI && notify("The 'Development' shape cannot have an incoming connection.", "warning", 1000);
        e.allowed = false;
      }
      if(dataItem && dataItem.type === "team" && e.args.connectorPosition === "end") {
        if(dataItem && dataItem.parentId !== undefined && dataItem.parentId !== null) {
          !e.updateUI && notify("A 'Team' shape can have only one incoming connection.", "warning", 1000);
          e.allowed = false;
        }
      }
      if(dataItem && dataItem.type === "employee") {
        if(e.args.connectorPosition === "start")
            e.allowed = false;
        if(e.args.connectorPosition === "end" && dataItem.parentId !== undefined && dataItem.parentId !== null) {
          !e.updateUI && notify("An 'Employee' shape can have only one incoming connection.", "warning", 1000);
          e.allowed = false;
        }
      }
    }
    else if(e.operation === "changeConnectorPoints") {
      if(e.args.newPoints.length > 2) {
        !e.updateUI && notify("You cannot add points to a connector.", "warning", 1000);
        e.allowed = false;
      }
    }
    else if(e.operation === "beforeChangeShapeText") {
      if(dataItem && dataItem.type === "root") {
        !e.updateUI && notify("You cannot change the 'Development' shape's text.", "warning", 1000);
        e.allowed = false;
      }
    }
    else if(e.operation === "changeShapeText") {
      if(e.args.text === "") {
        !e.updateUI && notify("A shape text cannot be empty.", "warning", 1000);
        e.allowed = false;
      }
    }
    else if(e.operation === "beforeChangeConnectorText") {
      e.allowed = false;
    }
  }
}

export default App;
