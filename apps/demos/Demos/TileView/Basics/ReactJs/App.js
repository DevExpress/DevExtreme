import React from 'react';
import TileView from 'devextreme-react/tile-view';
import { homes } from './data.js';

const getHomeImageStyle = (data) => ({ backgroundImage: `url(${data.ImageSrc})` });
const HomeImage = (data) => (
  <div
    className="tile-image"
    style={getHomeImageStyle(data)}
  ></div>
);
const App = () => (
  <TileView
    items={homes}
    itemRender={HomeImage}
  />
);
export default App;
