import React from 'react';
import Diagram, {
  ContextMenu,
  ContextToolbox,
  PropertiesPanel,
  Group,
  Tab,
  HistoryToolbar,
  ViewToolbar,
  MainToolbar,
  Command,
  Toolbox,
  DiagramTypes,
} from 'devextreme-react/diagram';
import { confirm } from 'devextreme/ui/dialog';
import 'whatwg-fetch';

const pageCommands = ['pageSize', 'pageOrientation', 'pageColor'];
const menuCommands = ['bringToFront', 'sendToBack', 'lock', 'unlock'];

function onCustomCommand(e: DiagramTypes.CustomCommandEvent) {
  if (e.name === 'clear') {
    const result = confirm('Are you sure you want to clear the diagram? This action cannot be undone.', 'Warning');
    result.then(
      (dialogResult) => {
        if (dialogResult) {
          e.component.import('');
        }
      },
    );
  }
}

export default function App() {
  const diagramRef = React.useRef(null);

  React.useEffect(() => {
    const diagram = diagramRef.current.instance;
    fetch('../../../../data/diagram-flow.json')
      .then((response) => response.json())
      .then((json) => {
        diagram.import(JSON.stringify(json));
      })
      .catch(() => {
        throw new Error('Data Loading Error');
      });
  }, []);

  return (
    <Diagram
      id="diagram"
      ref={diagramRef}
      onCustomCommand={onCustomCommand}
    >
      <ContextMenu
        enabled={true}
        commands={menuCommands as any}
      />
      <ContextToolbox
        enabled={true}
        category="flowchart"
        shapeIconsPerRow={5}
        width={200}
      />
      <PropertiesPanel visibility="visible">
        <Tab>
          <Group title="Page Properties" commands={pageCommands as any} />
        </Tab>
      </PropertiesPanel>
      <HistoryToolbar visible={false} />
      <ViewToolbar visible={true} />
      <MainToolbar visible={true}>
        <Command name="undo" />
        <Command name="redo" />
        <Command name="separator" />
        <Command name="fontName" />
        <Command name="fontSize" />
        <Command name="separator" />
        <Command name="bold" />
        <Command name="italic" />
        <Command name="underline" />
        <Command name="separator" />
        <Command name="fontColor" />
        <Command name="lineColor" />
        <Command name="fillColor" />
        <Command name="separator" />
        <Command name={'clear' as any} icon="clearsquare" text="Clear Diagram" />
      </MainToolbar>
      <Toolbox
        visibility="visible"
        showSearch={false}
        shapeIconsPerRow={4}
        width={220}
      >
        <Group category="general" title="General" />
        <Group category="flowchart" title="Flowchart" expanded={true} />
      </Toolbox>
    </Diagram>
  );
}
