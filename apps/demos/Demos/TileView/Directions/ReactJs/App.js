import React, { useCallback, useState } from 'react';
import SelectBox from 'devextreme-react/select-box';
import TileView from 'devextreme-react/tile-view';
import { directionLabel, homes } from './data.js';
import RenderHomeItem from './HomeItem.js';

const directions = ['horizontal', 'vertical'];
const App = () => {
  const [direction, setDirection] = useState('horizontal');
  const directionChanged = useCallback((e) => {
    setDirection(e.value);
  }, []);
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
