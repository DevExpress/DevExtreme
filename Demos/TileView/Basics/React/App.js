import React from 'react';

import TileView from 'devextreme-react/tile-view';

import { homes } from './data.js';

class App extends React.Component {
  render() {
    return (
      <TileView
        items={homes}
        itemRender={HomeImage}
      />
    );
  }
}

function HomeImage(data) {
  return <div className="dx-tile-image" style={{ backgroundImage: `url(${data.ImageSrc})` }}></div>;
}

export default App;
