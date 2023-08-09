import React from 'react';
import Diagram, {
  Nodes, AutoLayout, Toolbox, Group,
} from 'devextreme-react/diagram';
import ArrayStore from 'devextreme/data/array_store';
import service from './data.js';

const dataSource = new ArrayStore({
  key: 'this',
  data: service.getEmployees(),
});

export default function App() {
  return (
    <Diagram id="diagram">
      <Nodes dataSource={dataSource} textExpr="Title" itemsExpr="Items">
        <AutoLayout type="tree" />
      </Nodes>
      <Toolbox>
        <Group category="general" title="General" />
      </Toolbox>
    </Diagram>
  );
}
