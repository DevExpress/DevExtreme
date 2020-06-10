import React from 'react';
import Diagram, { CustomShape, ConnectionPoint, Group, Toolbox } from 'devextreme-react/diagram';
import 'whatwg-fetch';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.diagramRef = React.createRef();
  }

  componentDidMount() {
    var diagram = this.diagramRef.current.instance;
    fetch('../../../../data/diagram-hardware.json')
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
      <Diagram id="diagram" ref={this.diagramRef}>
        <CustomShape
          category="hardware"
          type="internet"
          title="Internet"
          backgroundImageUrl="../../../../images/shapes/internet.svg"
          backgroundImageLeft={0.15}
          backgroundImageTop={0}
          backgroundImageWidth={0.7}
          backgroundImageHeight={0.7}
          defaultWidth={0.75}
          defaultHeight={0.75}
          defaultText="Internet"
          allowEditText={true}
          textLeft={0}
          textTop={0.7}
          textWidth={1}
          textHeight={0.3}>
          <ConnectionPoint x={0.5} y={0} />
          <ConnectionPoint x={0.9} y={0.5} />
          <ConnectionPoint x={0.5} y={1} />
          <ConnectionPoint x={0.1} y={0.5} />
        </CustomShape>
        <CustomShape
          category="hardware"
          type="laptop"
          title="Laptop"
          backgroundImageUrl="../../../../images/shapes/laptop.svg"
          backgroundImageLeft={0.15}
          backgroundImageTop={0}
          backgroundImageWidth={0.7}
          backgroundImageHeight={0.7}
          defaultWidth={0.75}
          defaultHeight={0.75}
          defaultText="Laptop"
          allowEditText={true}
          textLeft={0}
          textTop={0.7}
          textWidth={1}
          textHeight={0.3}>
          <ConnectionPoint x={0.5} y={0} />
          <ConnectionPoint x={0.9} y={0.5} />
          <ConnectionPoint x={0.5} y={1} />
          <ConnectionPoint x={0.1} y={0.5} />
        </CustomShape>
        <CustomShape
          category="hardware"
          type="mobile"
          title="Mobile"
          backgroundImageUrl="../../../../images/shapes/mobile.svg"
          backgroundImageLeft={0.15}
          backgroundImageTop={0}
          backgroundImageWidth={0.7}
          backgroundImageHeight={0.7}
          defaultWidth={0.75}
          defaultHeight={0.75}
          defaultText="Mobile"
          allowEditText={true}
          textLeft={0}
          textTop={0.7}
          textWidth={1}
          textHeight={0.3}>
          <ConnectionPoint x={0.5} y={0} />
          <ConnectionPoint x={0.9} y={0.5} />
          <ConnectionPoint x={0.5} y={1} />
          <ConnectionPoint x={0.1} y={0.5} />
        </CustomShape>
        <CustomShape
          category="hardware"
          type="pc"
          title="PC"
          backgroundImageUrl="../../../../images/shapes/pc.svg"
          backgroundImageLeft={0.15}
          backgroundImageTop={0}
          backgroundImageWidth={0.7}
          backgroundImageHeight={0.7}
          defaultWidth={0.75}
          defaultHeight={0.75}
          defaultText="PC"
          allowEditText={true}
          textLeft={0}
          textTop={0.7}
          textWidth={1}
          textHeight={0.3}>
          <ConnectionPoint x={0.5} y={0} />
          <ConnectionPoint x={0.9} y={0.5} />
          <ConnectionPoint x={0.5} y={1} />
          <ConnectionPoint x={0.1} y={0.5} />
        </CustomShape>
        <CustomShape
          category="hardware"
          type="phone"
          title="Phone"
          backgroundImageUrl="../../../../images/shapes/phone.svg"
          backgroundImageLeft={0.15}
          backgroundImageTop={0}
          backgroundImageWidth={0.7}
          backgroundImageHeight={0.7}
          defaultWidth={0.75}
          defaultHeight={0.75}
          defaultText="Phone"
          allowEditText={true}
          textLeft={0}
          textTop={0.7}
          textWidth={1}
          textHeight={0.3}>
          <ConnectionPoint x={0.5} y={0} />
          <ConnectionPoint x={0.9} y={0.5} />
          <ConnectionPoint x={0.5} y={1} />
          <ConnectionPoint x={0.1} y={0.5} />
        </CustomShape>
        <CustomShape
          category="hardware"
          type="printer"
          title="Printer"
          backgroundImageUrl="../../../../images/shapes/printer.svg"
          backgroundImageLeft={0.15}
          backgroundImageTop={0}
          backgroundImageWidth={0.7}
          backgroundImageHeight={0.7}
          defaultWidth={0.75}
          defaultHeight={0.75}
          defaultText="Printer"
          allowEditText={true}
          textLeft={0}
          textTop={0.7}
          textWidth={1}
          textHeight={0.3}>
          <ConnectionPoint x={0.5} y={0} />
          <ConnectionPoint x={0.9} y={0.5} />
          <ConnectionPoint x={0.5} y={1} />
          <ConnectionPoint x={0.1} y={0.5} />
        </CustomShape>
        <CustomShape
          category="hardware"
          type="router"
          title="Router"
          backgroundImageUrl="../../../../images/shapes/router.svg"
          backgroundImageLeft={0.15}
          backgroundImageTop={0}
          backgroundImageWidth={0.7}
          backgroundImageHeight={0.7}
          defaultWidth={0.75}
          defaultHeight={0.75}
          defaultText="Router"
          allowEditText={true}
          textLeft={0}
          textTop={0.7}
          textWidth={1}
          textHeight={0.3}>
        </CustomShape>
        <CustomShape
          category="hardware"
          type="scaner"
          title="Scaner"
          backgroundImageUrl="../../../../images/shapes/scaner.svg"
          backgroundImageLeft={0.15}
          backgroundImageTop={0}
          backgroundImageWidth={0.7}
          backgroundImageHeight={0.7}
          defaultWidth={0.75}
          defaultHeight={0.75}
          defaultText="Scaner"
          allowEditText={true}
          textLeft={0}
          textTop={0.7}
          textWidth={1}
          textHeight={0.3}>
          <ConnectionPoint x={0.5} y={0} />
          <ConnectionPoint x={0.9} y={0.5} />
          <ConnectionPoint x={0.5} y={1} />
          <ConnectionPoint x={0.1} y={0.5} />
        </CustomShape>
        <CustomShape
          category="hardware"
          type="server"
          title="Server"
          backgroundImageUrl="../../../../images/shapes/server.svg"
          backgroundImageLeft={0.15}
          backgroundImageTop={0}
          backgroundImageWidth={0.7}
          backgroundImageHeight={0.7}
          defaultWidth={0.75}
          defaultHeight={0.75}
          defaultText="Server"
          allowEditText={true}
          textLeft={0}
          textTop={0.7}
          textWidth={1}
          textHeight={0.3}>
          <ConnectionPoint x={0.5} y={0} />
          <ConnectionPoint x={0.9} y={0.5} />
          <ConnectionPoint x={0.5} y={1} />
          <ConnectionPoint x={0.1} y={0.5} />
        </CustomShape>
        <CustomShape
          category="hardware"
          type="switch"
          title="Switch"
          backgroundImageUrl="../../../../images/shapes/switch.svg"
          backgroundImageLeft={0.15}
          backgroundImageTop={0}
          backgroundImageWidth={0.7}
          backgroundImageHeight={0.7}
          defaultWidth={0.75}
          defaultHeight={0.75}
          defaultText="Switch"
          allowEditText={true}
          textLeft={0}
          textTop={0.7}
          textWidth={1}
          textHeight={0.3}>
          <ConnectionPoint x={0.5} y={0} />
          <ConnectionPoint x={0.9} y={0.5} />
          <ConnectionPoint x={0.5} y={1} />
          <ConnectionPoint x={0.1} y={0.5} />
        </CustomShape>
        <CustomShape
          category="hardware"
          type="wifi"
          title="Wi Fi Router"
          backgroundImageUrl="../../../../images/shapes/wifi.svg"
          backgroundImageLeft={0.15}
          backgroundImageTop={0}
          backgroundImageWidth={0.7}
          backgroundImageHeight={0.7}
          defaultWidth={0.75}
          defaultHeight={0.75}
          defaultText="Wi Fi"
          allowEditText={true}
          textLeft={0}
          textTop={0.7}
          textWidth={1}
          textHeight={0.3}>
          <ConnectionPoint x={0.5} y={0} />
          <ConnectionPoint x={0.9} y={0.5} />
          <ConnectionPoint x={0.5} y={1} />
          <ConnectionPoint x={0.1} y={0.5} />
        </CustomShape>
        <Toolbox>
          <Group category="hardware" title="Hardware" />
        </Toolbox>
      </Diagram>
    );
  }
}

export default App;
