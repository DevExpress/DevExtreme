import React from 'react';
import Diagram from 'devextreme-react/diagram';
import 'whatwg-fetch';

export default function App() {
  const diagramRef = React.useRef();

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
    <Diagram id="diagram" ref={diagramRef} autoZoomMode="fitWidth" />
  );
}
