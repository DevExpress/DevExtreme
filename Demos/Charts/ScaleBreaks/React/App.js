import React from 'react';
import Chart, {
  Legend,
  Series,
  Tooltip,
  ValueAxis,
  BreakStyle,
} from 'devextreme-react/chart';
import SelectBox from 'devextreme-react/select-box';
import CheckBox from 'devextreme-react/check-box';
import { dataSource, lineStyleLabel, maxCountLabel } from './data.js';

const lineStyles = ['waved', 'straight'];
const breaksCount = [1, 2, 3, 4];

function App() {
  const [autoBreaksEnabledValue, setAutoBreaksEnabledValue] = React.useState(true);
  const [breaksCountValue, setBreaksCountValue] = React.useState(3);
  const [lineStyleValue, setLineStyleValue] = React.useState(lineStyles[0]);

  const changeBreaksCount = React.useCallback((e) => {
    setBreaksCountValue(e.value);
  }, [setBreaksCountValue]);

  const changeStyle = React.useCallback((e) => {
    setLineStyleValue(e.value);
  }, [setLineStyleValue]);

  const changeBreaksEnabledState = React.useCallback((e) => {
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
