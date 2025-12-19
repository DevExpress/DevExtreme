import React, { useCallback, useState } from 'react';
import Button from 'devextreme-react/button';
import RadioGroup from 'devextreme-react/radio-group';
import SelectBox from 'devextreme-react/select-box';
import type { SelectBoxTypes } from 'devextreme-react/select-box';
import NumberBox from 'devextreme-react/number-box';
import Notify from 'devextreme/ui/notify';
import HideToasts from 'devextreme/ui/toast/hide_toasts';
import type { NotifyStack } from './types.ts';

import {
  directions,
  positions,
  types,
  radioGroupItems,
  positionTopLabel,
  directionLabel,
  positionBottomLabel,
  positionLeftLabel,
  positionRightLabel,
  positionLabel,
} from './data.ts';

function App() {
  const [id, setId] = useState<number>(1);
  const [isPredefined, setIsPredefined] = useState<boolean>(true);
  const [predefinedPosition, setPredefinedPosition] = useState<NotifyStack['position']>('bottom center');
  const [coordinatePosition, setCoordinatePosition] = useState<NotifyStack['position']>({
    top: undefined,
    left: undefined,
    bottom: undefined,
    right: undefined,
  });
  const [direction, setDirection] = useState<NotifyStack['direction']>('up-push');

  const topNumberBoxValueChanged = useCallback(
    (top: number | undefined): void => setCoordinatePosition({ ...coordinatePosition, top }),
    [coordinatePosition],
  );

  const bottomNumberBoxValueChanged = useCallback(
    (bottom: number | undefined): void => setCoordinatePosition({ ...coordinatePosition, bottom }),
    [coordinatePosition],
  );

  const leftNumberBoxValueChanged = useCallback(
    (left: number | undefined): void => setCoordinatePosition({ ...coordinatePosition, left }),
    [coordinatePosition],
  );

  const rightNumberBoxValueChanged = useCallback(
    (right: number | undefined): void => setCoordinatePosition({ ...coordinatePosition, right }),
    [coordinatePosition],
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
    <>
      <div className='options'>
        <div>Position</div>
        <RadioGroup
          layout='horizontal'
          defaultValue='predefined'
          items={radioGroupItems}
          onValueChange={(value: string): void => setIsPredefined(value === 'predefined')} />
        <SelectBox
          items={positions}
          value={predefinedPosition}
          inputAttr={positionLabel}
          onSelectionChanged={({ selectedItem }: SelectBoxTypes.SelectionChangedEvent): void => setPredefinedPosition(selectedItem)}
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
          onSelectionChanged={({ selectedItem }: SelectBoxTypes.SelectionChangedEvent): void => setDirection(selectedItem)} />
        <div className='section'>
          <Button text='Show' width='48%' onClick={show} />
          <Button text='Hide all' width='48%' onClick={() => HideToasts()} />
        </div>
      </div>
    </>
  );
}

export default App;
