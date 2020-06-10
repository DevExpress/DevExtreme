import React from 'react';
import { Diagram } from 'devextreme-react';
import 'whatwg-fetch';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.diagramRef = React.createRef();
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
      <Diagram id="diagram" ref={this.diagramRef} autoZoomMode="fitWidth" />
    );
  }
}

export default App;
