import React from 'react';
import Diagram, { Nodes, AutoLayout, Edges, Toolbox, Group } from 'devextreme-react/diagram';
import ArrayStore from 'devextreme/data/array_store';
import service from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.orgItemsDataSource = new ArrayStore({
      key: 'id',
      data: service.getOrgItems()
    });
    this.orgLinksDataSource = new ArrayStore({
      key: 'id',
      data: service.getOrgLinks()
    });
  }

  render() {
    return (
      <Diagram id="diagram">
        <Nodes dataSource={this.orgItemsDataSource} typeExpr={this.itemTypeExpr} textExpr="name"
          widthExpr={this.itemWidthExpr} heightExpr={this.itemHeightExpr} textStyleExpr={this.itemTextStyleExpr} styleExpr={this.itemStyleExpr}>
          <AutoLayout type="tree" orientation="horizontal" />
        </Nodes>
        <Edges dataSource={this.orgLinksDataSource} styleExpr={this.linkStyleExpr}
          fromLineEndExpr={this.linkFromLineEndExpr} toLineEndExpr={this.linkToLineEndExpr} />
        <Toolbox>
          <Group category="general" title="General" />
        </Toolbox>
      </Diagram>
    );
  }

  itemTypeExpr(obj, value) {
    if(value) {
      obj.type = (value === 'rectangle') ? undefined : 'group';
    } else {
      return obj.type === 'group' ? 'ellipse' : 'rectangle';
    }
  }
  itemWidthExpr(obj, value) {
    if(value) {
      obj.width = value;
    } else {
      return obj.width || (obj.type === 'group' && 1.5) || 1;
    }
  }
  itemHeightExpr(obj, value) {
    if(value) {
      obj.height = value;
    } else {
      return obj.height || (obj.type === 'group' && 1) || 0.75;
    }
  }
  itemTextStyleExpr(obj) {
    if(obj.level === 'senior') {
      return { 'font-weight': 'bold', 'text-decoration': 'underline' };
    }
    return {};
  }
  itemStyleExpr(obj) {
    let style = { 'stroke': '#444444' };
    if(obj.type === 'group') {
      style['fill'] = '#f3f3f3';
    }
    return style;
  }
  linkStyleExpr() {
    return { 'stroke': '#444444' };
  }
  linkFromLineEndExpr() {
    return 'none';
  }
  linkToLineEndExpr() {
    return 'none';
  }
}

export default App;
