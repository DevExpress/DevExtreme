import React from 'react';
import TileView from 'devextreme-react/tile-view';
import SelectBox from 'devextreme-react/select-box';
import RenderHomeItem from './HomeItem.js';
import { homes, directionLabel } from './data.js';

const directions = ['horizontal', 'vertical'];
const App = () => {
  const [direction, setDirection] = React.useState('horizontal');
  const directionChanged = React.useCallback(
    (e) => {
      setDirection(e.value);
    },
    [setDirection],
  );
  return (
    <div>
      <TileView
        items={homes}
        itemRender={RenderHomeItem}
        height={390}
        baseItemHeight={120}
        baseItemWidth={185}
        width="100%"
        itemMargin={10}
        direction={direction}
      />
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <span>Direction</span>&nbsp;
          <SelectBox
            items={directions}
            inputAttr={directionLabel}
            value={direction}
            onValueChanged={directionChanged}
          ></SelectBox>
        </div>
      </div>
    </div>
  );
};
export default App;
