import React from 'react';

import TileView from 'devextreme-react/tile-view';

import { homes } from './data.ts';

interface Home {
  ImageSrc: string;
}

const getHomeImageStyle = (data: Home) => ({ backgroundImage: `url(${data.ImageSrc})` });

const HomeImage = (data: Home) => <div className="tile-image" style={getHomeImageStyle(data)}></div>;

const App = () => (
  <TileView
    items={homes}
    itemRender={HomeImage}
  />
);

export default App;
