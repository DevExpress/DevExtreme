import React, { useCallback, useState } from 'react';
import Button from 'devextreme-react/button';
import RadioGroup from 'devextreme-react/radio-group';
import SelectBox from 'devextreme-react/select-box';
import NumberBox from 'devextreme-react/number-box';
import Notify from 'devextreme/ui/notify';
import HideToasts from 'devextreme/ui/toast/hide_toasts';

import {
  directions, positions, types, radioGroupItems, positionTopLabel, directionLabel,
  positionBottomLabel, positionLeftLabel, positionRightLabel, positionLabel,
} from './data.ts';

type NotifyStack = (typeof Notify)['arguments'][1];

function App() {
  const [id, setId] = useState(1);
  const [isPredefined, setIsPredefined] = useState(true);
  const [predefinedPosition, setPredefinedPosition] = useState('bottom center');
  const [coordinatePosition, setCoordinatePosition] = useState({
    top: undefined,
    left: undefined,
    bottom: undefined,
    right: undefined,
  });
  const [direction, setDirection] = useState('up-push' as NotifyStack['direction']);

  const topNumberBoxValueChanged = useCallback(
    (top) => setCoordinatePosition({ ...coordinatePosition, top }),
    [coordinatePosition, setCoordinatePosition],
  );

  const bottomNumberBoxValueChanged = useCallback(
    (bottom) => setCoordinatePosition({ ...coordinatePosition, bottom }),
    [coordinatePosition, setCoordinatePosition],
  );

  const leftNumberBoxValueChanged = useCallback(
    (left) => setCoordinatePosition({ ...coordinatePosition, left }),
    [coordinatePosition, setCoordinatePosition],
  );

  const rightNumberBoxValueChanged = useCallback(
    (right) => setCoordinatePosition({ ...coordinatePosition, right }),
    [coordinatePosition, setCoordinatePosition],
  );

  const show = useCallback(() => {
    const position: NotifyStack['position'] = isPredefined ? predefinedPosition : coordinatePosition;

    Notify({
      message: `Toast ${id}`,
      height: 45,
      width: 150,
      minWidth: 150,
      type: types[Math.floor(Math.random() * 4)],
      displayTime: 3500,
      animation: {
        show: {
          type: 'fade', duration: 400, from: 0, to: 1,
        },
        hide: { type: 'fade', duration: 40, to: 0 },
      },
    }, {
      position,
      direction,
    });
    setId(id + 1);
  }, [id, isPredefined, predefinedPosition, coordinatePosition, direction]);

  return (
    <React.Fragment>
      <div className='options'>
        <div>Position</div>
        <RadioGroup
          layout='horizontal'
          defaultValue='predefined'
          items={radioGroupItems}
          onValueChange={(value) => setIsPredefined(value === 'predefined')} />
        <SelectBox
          items={positions}
          value={predefinedPosition}
          inputAttr={positionLabel}
          onSelectionChanged={({ selectedItem }) => setPredefinedPosition(selectedItem)}
          visible={isPredefined} />
        <div className='section'>
          <NumberBox
            visible={!isPredefined}
            placeholder='top'
            defaultValue={null}
            valueChangeEvent='keyup'
            disabled={!!coordinatePosition.bottom}
            inputAttr={positionTopLabel}
            onValueChange={topNumberBoxValueChanged} />
          <NumberBox
            visible={!isPredefined}
            placeholder='bottom'
            defaultValue={null}
            valueChangeEvent='keyup'
            inputAttr={positionBottomLabel}
            disabled={!!coordinatePosition.top}
            onValueChange={bottomNumberBoxValueChanged} />
        </div>
        <div className='section'>
          <NumberBox
            visible={!isPredefined}
            placeholder='left'
            defaultValue={null}
            valueChangeEvent='keyup'
            inputAttr={positionLeftLabel}
            disabled={!!coordinatePosition.right}
            onValueChange={leftNumberBoxValueChanged} />
          <NumberBox
            visible={!isPredefined}
            placeholder='right'
            defaultValue={null}
            valueChangeEvent='keyup'
            inputAttr={positionRightLabel}
            disabled={!!coordinatePosition.left}
            onValueChange={rightNumberBoxValueChanged} />
        </div>
        <div>Direction</div>
        <SelectBox
          items={directions}
          inputAttr={directionLabel}
          value={direction}
          onSelectionChanged={({ selectedItem }) => setDirection(selectedItem)} />
        <div className='section'>
          <Button text='Show' width='48%' onClick={show} />
          <Button text='Hide all' width='48%' onClick={() => HideToasts()} />
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;
