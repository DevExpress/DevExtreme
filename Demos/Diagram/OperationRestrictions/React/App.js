import React from 'react';
import Diagram, { CustomShape, Nodes, AutoLayout, ContextToolbox, Toolbox, PropertiesPanel, Group } from 'devextreme-react/diagram';
import notify from 'devextreme/ui/notify';
import ArrayStore from 'devextreme/data/array_store';
import service from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.orgItemsDataSource = new ArrayStore({
      key: 'ID',
      data: service.getOrgItems()
    });
    this.onRequestEditOperation = this.onRequestEditOperation.bind(this);
    this.onRequestLayoutUpdate = this.onRequestLayoutUpdate.bind(this);
  }

  render() {
    return (
      <Diagram id="diagram" onRequestEditOperation={this.onRequestEditOperation} onRequestLayoutUpdate={this.onRequestLayoutUpdate}>
        <CustomShape category="items" type="root" baseType="octagon"
          defaultText="Development" />
        <CustomShape category="items" type="team" baseType="ellipse"
          title="Team" defaultText="Team Name" />
        <CustomShape category="items" type="employee" baseType="rectangle"
          title="Employee" defaultText="Employee Name" />
        <Nodes dataSource={this.orgItemsDataSource} keyExpr="ID" textExpr="Name" typeExpr="Type" parentKeyExpr="ParentID">
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

  showToast(text) {
    notify({
      position: { at: 'top', my: 'top', of: '#diagram', offset: '0 4' },
      message: text,
      type: 'warning',
      delayTime: 2000
    });
  }
  onRequestLayoutUpdate(e) {
    for(var i = 0; i < e.changes.length; i++) {
      if(e.changes[i].type === 'remove') {
        e.allowed = true;
      } else if(e.changes[i].data.ParentID !== undefined && e.changes[i].data.ParentID !== null) {
        e.allowed = true;
      }
    }
  }
  onRequestEditOperation(e) {
    if(e.operation === 'addShape') {
      if(e.args.shape.type !== 'employee' && e.args.shape.type !== 'team') {
        !e.updateUI && this.showToast('You can add only a \'Team\' or \'Employee\' shape.');
        e.allowed = false;
      }
    }
    else if(e.operation === 'deleteShape') {
      var dataItem = e.args.shape && e.args.shape.dataItem;
      if(dataItem && dataItem.Type === 'root') {
        !e.updateUI && this.showToast('You cannot delete the \'Development\' shape.');
        e.allowed = false;
      }
      if(dataItem && dataItem.Type === 'team') {
        var children = service.getOrgItems().filter(function(item) {
          return item.ParentID === dataItem.ID;
        });
        if(children.length > 0) {
          !e.updateUI && this.showToast('You cannot delete a \'Team\' shape that has a child shape.');
          e.allowed = false;
        }
      }
    }
    else if(e.operation === 'resizeShape') {
      if(e.args.newSize.width < 1 || e.args.newSize.height < 0.75) {
        !e.updateUI && this.showToast('The shape size is too small.');
        e.allowed = false;
      }
    }
    else if(e.operation === 'changeConnection') {
      var dataItem = e.args.newShape && e.args.newShape.dataItem;
      if(dataItem && dataItem.Type === 'root' && e.args.connectorPosition === 'end') {
        !e.updateUI && this.showToast('The \'Development\' shape cannot have an incoming connection.');
        e.allowed = false;
      }
      if(dataItem && dataItem.Type === 'team' && e.args.connectorPosition === 'end') {
        if(dataItem && dataItem.ParentID !== undefined && dataItem.ParentID !== null) {
          !e.updateUI && this.showToast('A \'Team\' shape can have only one incoming connection.');
          e.allowed = false;
        }
      }
      if(dataItem && dataItem.Type === 'employee') {
        if(e.args.connectorPosition === 'start') {
          e.allowed = false;
        }
        if(e.args.connectorPosition === 'end' && dataItem.ParentID !== undefined && dataItem.ParentID !== null) {
          !e.updateUI && this.showToast('An \'Employee\' shape can have only one incoming connection.');
          e.allowed = false;
        }
      }
    }
    else if(e.operation === 'changeConnectorPoints') {
      if(e.args.newPoints.length > 2) {
        !e.updateUI && this.showToast('You cannot add points to a connector.');
        e.allowed = false;
      }
    }
    else if(e.operation === 'beforeChangeShapeText') {
      var dataItem = e.args.shape && e.args.shape.dataItem;
      if(dataItem && dataItem.Type === 'root') {
        !e.updateUI && this.showToast('You cannot change the \'Development\' shape\'s text.');
        e.allowed = false;
      }
    }
    else if(e.operation === 'changeShapeText') {
      if(e.args.text === '') {
        !e.updateUI && this.showToast('A shape text cannot be empty.');
        e.allowed = false;
      }
    }
    else if(e.operation === 'beforeChangeConnectorText') {
      e.allowed = false;
    }
  }
}

export default App;
