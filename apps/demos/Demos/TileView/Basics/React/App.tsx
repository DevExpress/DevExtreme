import React from 'react';

import TileView from 'devextreme-react/tile-view';

import { homes } from './data.ts';

interface Home {
  ImageSrc: string;
}

const HomeImage = (data: Home) => <div className="tile-image" style={{ backgroundImage: `url(${data.ImageSrc})` }}></div>;

const App = () => (
  <TileView
    items={homes}
    itemRender={HomeImage}
  />
);

export default App;
