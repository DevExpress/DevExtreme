import React from 'react';
import Diagram, {
  Nodes, AutoLayout, Edges, Toolbox, Group,
} from 'devextreme-react/diagram';
import ArrayStore from 'devextreme/data/array_store';
import service from './data.ts';

const orgItemsDataSource = new ArrayStore({
  key: 'id',
  data: service.getOrgItems(),
});
const orgLinksDataSource = new ArrayStore({
  key: 'id',
  data: service.getOrgLinks(),
});

function itemTypeExpr(obj: { type: string; }, value: string) {
  if (value) {
    obj.type = (value === 'rectangle') ? undefined : 'group';
  } else {
    return obj.type === 'group' ? 'ellipse' : 'rectangle';
  }
  return null;
}

function itemWidthExpr(obj: { width: number; type: string; }, value) {
  if (value) {
    obj.width = value;
  } else {
    return obj.width || (obj.type === 'group' && 1.5) || 1;
  }
  return null;
}

function itemHeightExpr(obj: { height: number; type: string; }, value) {
  if (value) {
    obj.height = value;
  } else {
    return obj.height || (obj.type === 'group' && 1) || 0.75;
  }
  return null;
}

function itemTextStyleExpr(obj: { level: string; }) {
  if (obj.level === 'senior') {
    return { 'font-weight': 'bold', 'text-decoration': 'underline' };
  }
  return {};
}

function itemStyleExpr(obj: { type: string; }) {
  const style: React.CSSProperties = { stroke: '#444444' };
  if (obj.type === 'group') {
    style.fill = '#f3f3f3';
  }
  return style;
}

function linkStyleExpr() {
  return { stroke: '#444444' };
}

function linkFromLineEndExpr() {
  return 'none';
}

function linkToLineEndExpr() {
  return 'none';
}

export default function App() {
  return (
    <Diagram id="diagram">
      <Nodes
        dataSource={orgItemsDataSource}
        typeExpr={itemTypeExpr}
        textExpr="name"
        widthExpr={itemWidthExpr}
        heightExpr={itemHeightExpr}
        textStyleExpr={itemTextStyleExpr}
        styleExpr={itemStyleExpr}>
        <AutoLayout type="tree" orientation="horizontal" />
      </Nodes>
      <Edges dataSource={orgLinksDataSource} styleExpr={linkStyleExpr}
        fromLineEndExpr={linkFromLineEndExpr} toLineEndExpr={linkToLineEndExpr} />
      <Toolbox>
        <Group category="general" title="General" />
      </Toolbox>
    </Diagram>
  );
}
