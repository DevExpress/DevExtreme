import React from 'react';
import TileView from 'devextreme-react/tile-view';
import { homes } from './data.ts';

const HomeImage = (data) => <div className="dx-tile-image" style={{ backgroundImage: `url(${data.ImageSrc})` }}></div>;

const App = () => (
  <TileView
    items={homes}
    itemRender={HomeImage}
  />
);

export default App;
