import React from 'react';
import Diagram, {
  Nodes, AutoLayout, Edges, Toolbox, Group,
} from 'devextreme-react/diagram';
import { ArrayStore } from 'devextreme-react/common/data';
import service from './data.ts';

const orgItemsDataSource = new ArrayStore({
  key: 'id',
  data: service.getOrgItems(),
});
const orgLinksDataSource = new ArrayStore({
  key: 'id',
  data: service.getOrgLinks(),
});

function itemTypeExpr(obj: { type: string | undefined; }, value: string) {
  if (value) {
    obj.type = (value === 'rectangle') ? undefined : 'group';
    return null;
  }
  return obj.type === 'group' ? 'ellipse' : 'rectangle';
}

function itemWidthExpr(obj: { width: number; type: string; }, value: number) {
  if (value) {
    obj.width = value;
    return null;
  }
  return obj.width || (obj.type === 'group' && 1.5) || 1;
}

function itemHeightExpr(obj: { height: number; type: string; }, value: number) {
  if (value) {
    obj.height = value;
    return null;
  }
  return obj.height || (obj.type === 'group' && 1) || 0.75;
}

function itemTextStyleExpr(obj: { level: string; }) {
  if (obj.level === 'senior') {
    return { 'font-weight': 'bold', 'text-decoration': 'underline' };
  }
  return {};
}

function itemStyleExpr(obj: { type: string; }) {
  const style: { stroke: string; fill?: string } = { stroke: '#444444' };
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
