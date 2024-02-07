import React, { useCallback, useState } from 'react';
import Chart, {
  Legend,
  Series,
  Tooltip,
  ValueAxis,
  BreakStyle,
} from 'devextreme-react/chart';
import SelectBox, { SelectBoxTypes } from 'devextreme-react/select-box';
import CheckBox, { CheckBoxTypes } from 'devextreme-react/check-box';
import { dataSource, lineStyleLabel, maxCountLabel } from './data.ts';

const lineStyles: ('straight' | 'waved')[] = ['waved', 'straight'];
const breaksCount = [1, 2, 3, 4];

function App() {
  const [autoBreaksEnabledValue, setAutoBreaksEnabledValue] = useState(true);
  const [breaksCountValue, setBreaksCountValue] = useState(3);
  const [lineStyleValue, setLineStyleValue] = useState(lineStyles[0]);

  const changeBreaksCount = useCallback((e: SelectBoxTypes.ValueChangedEvent) => {
    setBreaksCountValue(e.value);
  }, [setBreaksCountValue]);

  const changeStyle = useCallback((e: SelectBoxTypes.ValueChangedEvent) => {
    setLineStyleValue(e.value);
  }, [setLineStyleValue]);

  const changeBreaksEnabledState = useCallback((e: CheckBoxTypes.ValueChangedEvent) => {
    setAutoBreaksEnabledValue(e.value);
  }, [setAutoBreaksEnabledValue]);

  return (
    <div>
      <Chart
        id="chart"
        title={'Relative Masses of the Heaviest\n Solar System Objects'}
        dataSource={dataSource}>
        <Series valueField="mass" argumentField="name" type="bar" />
        <ValueAxis
          visible={true}
          autoBreaksEnabled={autoBreaksEnabledValue}
          maxAutoBreakCount={breaksCountValue}>
          <BreakStyle line={lineStyleValue} />
        </ValueAxis>
        <Legend visible={false} />
        <Tooltip enabled={true} />
      </Chart>
      <div className="options">
        <div className="caption">Options</div>
        <div className="options-container">
          <div className="option">
            <CheckBox
              className="checkbox"
              text="Enable Breaks"
              onValueChanged={changeBreaksEnabledState}
              value={autoBreaksEnabledValue}
            />
          </div>
          <div className="option">
            <span>Max Count </span>
            <SelectBox
              items={breaksCount}
              inputAttr={maxCountLabel}
              value={breaksCountValue}
              onValueChanged={changeBreaksCount}
              width={80}
            />
          </div>
          <div className="option">
            <span>Style </span>
            <SelectBox
              items={lineStyles}
              inputAttr={lineStyleLabel}
              value={lineStyleValue}
              onValueChanged={changeStyle}
              width={120}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
