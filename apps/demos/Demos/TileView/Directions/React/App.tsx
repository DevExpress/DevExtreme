import React, { useCallback, useState } from 'react';
import TileView, { TileViewTypes } from 'devextreme-react/tile-view';
import SelectBox, { SelectBoxTypes } from 'devextreme-react/select-box';
import RenderHomeItem from './HomeItem.tsx';
import { homes, directionLabel } from './data.ts';

const directions = ['horizontal', 'vertical'];

const App = () => {
  const [direction, setDirection] = useState<TileViewTypes.Properties['direction']>('horizontal');

  const directionChanged = useCallback((e: SelectBoxTypes.ValueChangedEvent) => {
    setDirection(e.value);
  }, [setDirection]);

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
        direction={direction}
      />
      <div className='options'>
        <div className='caption'>Options</div>
        <div className='option'>
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
