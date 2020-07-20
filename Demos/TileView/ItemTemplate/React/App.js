import React from 'react';
import TileView from 'devextreme-react/tile-view';
import { homes } from './data.js';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <TileView items={homes} height={390} baseItemHeight={120} baseItemWidth={185} itemMargin={10} itemComponent={TileViewItem} />
    );
  }
}

function TileViewItem({ data }) {
  return (
    <div className="dx-tile-content">
      <div className="price">{currencyFormatter.format(data.Price)}</div>
      <div className="image" style={{ backgroundImage: `url(${data.ImageSrc})` }}></div>
    </div>
  );
}

export default App;
