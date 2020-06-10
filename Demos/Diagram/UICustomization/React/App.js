import React from 'react';
import Diagram, { ContextMenu, ContextToolbox, PropertiesPanel, Group, Tab, HistoryToolbar, ViewToolbar, MainToolbar, Command, Toolbox } from 'devextreme-react/diagram';
import dialog from 'devextreme/ui/dialog';
import 'whatwg-fetch';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.diagramRef = React.createRef();
  }

  onCustomCommand(e) {
    if(e.name === 'clear') {
      var result = dialog.confirm('Are you sure you want to clear the diagram? This action cannot be undone.', 'Warning');
      result.then(
        function(dialogResult) {
          if(dialogResult) {
            e.component.import('');
          }
        }
      );
    }
  }
  componentDidMount() {
    var diagram = this.diagramRef.current.instance;
    fetch('../../../../data/diagram-flow.json')
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        diagram.import(JSON.stringify(json));
      })
      .catch(function() {
        throw 'Data Loading Error';
      });
  }
  render() {
    return (
      <Diagram id="diagram" ref={this.diagramRef} onCustomCommand={this.onCustomCommand}>
        <ContextMenu enabled={true} commands={['bringToFront', 'sendToBack', 'lock', 'unlock']} />
        <ContextToolbox enabled={true} category="flowchart" />
        <PropertiesPanel visibility="visible">
          <Tab>
            <Group title="Page Properties" commands={['pageSize', 'pageOrientation', 'pageColor']} />
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
          <Command name="clear" icon="clearsquare" text="Clear Diagram" />
        </MainToolbar>
        <Toolbox visibility="visible">
          <Group category="general" title="General" />
          <Group category="flowchart" title="Flowchart" expanded={true} />
        </Toolbox>
      </Diagram>
    );
  }
}

export default App;
