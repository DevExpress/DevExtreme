import React, { useCallback, useState } from 'react';
import NumberBox, { NumberBoxTypes } from 'devextreme-react/number-box';
import {
  Chart,
  CommonSeriesSettings,
  Series,
  Point,
  ArgumentAxis,
  ValueAxis,
  Legend,
} from 'devextreme-react/chart';
import { generateDataSource, customPositionLabel, offsetLabel } from './data.ts';

const dataSource = generateDataSource();
const defaultVisualRange = [-20, 20];

function App() {
  const [argumentCustomPosition, setArgumentCustomPosition] = useState(0);
  const [argumentOffset, setArgumentOffset] = useState(0);
  const [valueCustomPosition, setValueCustomPosition] = useState(0);
  const [valueOffset, setValueOffset] = useState(0);

  const changeArgumentPosition = useCallback((e: NumberBoxTypes.ValueChangedEvent) => {
    setArgumentCustomPosition(e.value);
  }, [setArgumentCustomPosition]);

  const changeArgumentOffset = useCallback((e: NumberBoxTypes.ValueChangedEvent) => {
    setArgumentOffset(e.value);
  }, [setArgumentOffset]);

  const changeValuePosition = useCallback((e: NumberBoxTypes.ValueChangedEvent) => {
    setValueCustomPosition(e.value);
  }, [setValueCustomPosition]);

  const changeValueOffset = useCallback((e: NumberBoxTypes.ValueChangedEvent) => {
    setValueOffset(e.value);
  }, [setValueOffset]);

  return (
    <div>
      <Chart id="chart" dataSource={dataSource}>
        <CommonSeriesSettings type='scatter' />
        <Series argumentField='x1' valueField='y1' />
        <Series argumentField='x2' valueField='y2'>
          <Point symbol='triangleDown' />
        </Series>
        <ArgumentAxis
          defaultVisualRange={defaultVisualRange}
          customPosition={argumentCustomPosition}
          offset={argumentOffset}
        />
        <ValueAxis
          defaultVisualRange={defaultVisualRange}
          customPosition={valueCustomPosition}
          offset={valueOffset}
          endOnTick={false}
        />
        <Legend visible={false} />
      </Chart>
      <div className='options'>
        <div className='caption'>Options</div>
        <div className="common">
          <div className='block left'>
            <span>Argument Axis</span>
            <div className='option'>
              <span>Custom position:</span>
              <NumberBox
                value={argumentCustomPosition}
                showSpinButtons={true}
                inputAttr={customPositionLabel}
                onValueChanged={changeArgumentPosition} />
            </div>
            <div className='option'>
              <span>Offset:</span>
              <NumberBox
                value={argumentOffset}
                showSpinButtons={true}
                inputAttr={offsetLabel}
                onValueChanged={changeArgumentOffset} />
            </div>
          </div>
          <div className='block right'>
            <span>Value Axis</span>
            <div className='option'>
              <span>Custom position:</span>
              <NumberBox
                value={valueCustomPosition}
                showSpinButtons={true}
                inputAttr={customPositionLabel}
                onValueChanged={changeValuePosition} />
            </div>
            <div className='option'>
              <span>Offset:</span>
              <NumberBox
                value={valueOffset}
                showSpinButtons={true}
                inputAttr={offsetLabel}
                onValueChanged={changeValueOffset} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
