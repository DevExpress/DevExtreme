import React from 'react';

import TileView from 'devextreme-react/tile-view';
import SelectBox from 'devextreme-react/select-box';

import RenderHomeItem from './HomeItem.js';
import { homes, directionLabel } from './data.js';

const directions = ['horizontal', 'vertical'];

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      direction: 'horizontal',
    };

    this.directionChanged = this.directionChanged.bind(this);
  }

  render() {
    return (
      <div>
        <TileView
          items={homes}
          itemRender={RenderHomeItem}
          height={390}
          baseItemHeight={120}
          baseItemWidth={185}
          width='100%'
          itemMargin={10}
          direction={this.state.direction}
        />
        <div className='options'>
          <div className='caption'>Options</div>
          <div className='option'>
            <span>Direction</span>&nbsp;
            <SelectBox
              items={directions}
              inputAttr={directionLabel}
              value={this.state.direction}
              onValueChanged={this.directionChanged}>
            </SelectBox>
          </div>
        </div>
      </div>
    );
  }

  directionChanged(e) {
    this.setState({
      direction: e.value,
    });
  }
}

export default App;
