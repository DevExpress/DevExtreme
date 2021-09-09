import React from 'react';
import Diagram from 'devextreme-react/diagram';
import 'whatwg-fetch';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.diagramRef = React.createRef();
  }

  componentDidMount() {
    const diagram = this.diagramRef.current.instance;
    fetch('../../../../data/diagram-flow.json')
      .then((response) => response.json())
      .then((json) => {
        diagram.import(JSON.stringify(json));
      })
      .catch(() => {
        throw new Error('Data Loading Error');
      });
  }

  render() {
    return (
      <Diagram id="diagram" ref={this.diagramRef} autoZoomMode="fitWidth" />
    );
  }
}

export default App;
