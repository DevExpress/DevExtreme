import React from 'react';
import Diagram, { CustomShape, Nodes, AutoLayout, ContextToolbox, Toolbox, PropertiesPanel, Group } from 'devextreme-react/diagram';
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
        <Nodes dataSource={this.orgItemsDataSource} typeExpr={this.itemTypeExpr} textExpr="name" parentKeyExpr="parentId">
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

  itemTypeExpr(obj, value) {
    if(value) {
      if(value !== 'employee') {
        obj.type = value;
      } else {
        obj.type = undefined;
      }
    } else {
      if(obj.type !== undefined) {
        return obj.type;
      }
      return 'employee';
    }
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
    if(e.operation === 'addShape') {
      if(e.args.shape.type !== 'employee' && e.args.shape.type !== 'team') {
        e.allowed = false;
      }
    } else if(e.operation === 'deleteShape') {
      if(e.args.shape.dataItem && e.args.shape.dataItem.type === 'root') {
        e.allowed = false;
      }
      if(e.args.shape.dataItem && e.args.shape.dataItem.type === 'team') {
        var children = service.getOrgItems().filter(function(item) {
          return item.parentId === e.args.shape.dataItem.id;
        });
        if(children.length > 0) {
          e.allowed = false;
        }
      }
    } else if(e.operation === 'deleteConnector') {
      e.allowed = false;
    } else if(e.operation === 'changeConnection') {
      if(e.args.connectorPosition === 'end' && e.args.shape === undefined) {
        e.allowed = false;
      }
      if(e.args.shape.dataItem && e.args.shape.dataItem.type === 'root' && e.args.connectorPosition === 'end') {
        e.allowed = false;
      }
      if(e.args.shape.dataItem && e.args.shape.dataItem.type === undefined) {
        if(e.args.connectorPosition === 'start') {
          e.allowed = false;
        }
        if(e.args.connectorPosition === 'end' && e.args.shape.dataItem.parentId !== undefined && e.args.shape.dataItem.parentId !== null) {
          e.allowed = false;
        }
      }
    } else if(e.operation === 'changeConnectorPoints') {
      if(e.args.newPoints.length > 2) {
        e.allowed = false;
      }
    } else if(e.operation === 'beforeChangeShapeText') {
      if(e.args.shape.dataItem && e.args.shape.dataItem.type === 'root') {
        e.allowed = false;
      }
    } else if(e.operation === 'changeShapeText') {
      if(e.args.text === '') {
        e.allowed = false;
      }
    } else if(e.operation === 'beforeChangeConnectorText') {
      e.allowed = false;
    }
  }
}

export default App;
