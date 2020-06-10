import React from 'react';
import { TileView } from 'devextreme-react';
import { homes } from './data.js';
import Globalize from 'globalize';
import 'devextreme/localization/globalize/currency';

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
      <div className="price">{Globalize.formatCurrency(data.Price, 'USD', { maximumFractionDigits: 0 })}</div>
      <div className="image" style={{ backgroundImage: `url(${data.ImageSrc})` }}></div>
    </div>
  );
}

export default App;
