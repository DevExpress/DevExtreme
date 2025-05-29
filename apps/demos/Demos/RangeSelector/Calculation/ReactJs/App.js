import React, { useCallback, useState } from 'react';
import RangeSelector, {
  Margin,
  Scale,
  MinorTick,
  Marker,
  Label,
  Behavior,
  SliderMarker,
} from 'devextreme-react/range-selector';
import { SelectBox } from 'devextreme-react/select-box';

const startValue = new Date(2011, 0, 1);
const endValue = new Date(2011, 11, 31);
const behaviorModes = ['onHandleMove', 'onHandleRelease'];
const valueChangeModeLabel = { 'aria-label': 'Value Change Mode' };
function App() {
  const [workingDaysCount, setWorkingDaysCount] = useState(
    calculateWorkdays([startValue, endValue]),
  );
  const [behaviorMode, setBehaviorMode] = useState(behaviorModes[0]);
  const processRange = useCallback(
    (e) => {
      setWorkingDaysCount(calculateWorkdays(e.value));
    },
    [setWorkingDaysCount],
  );
  const setBehavior = useCallback(
    (data) => {
      setBehaviorMode(data.value);
    },
    [setBehaviorMode],
  );
  return (
    <div id="range-selector-demo">
      <RangeSelector
        id="range-selector"
        title="Calculate the Working Days Count in a Date Period"
        onValueChanged={processRange}
      >
        <Margin top={50} />
        <Scale
          startValue={startValue}
          endValue={endValue}
          minorTickInterval="day"
          tickInterval="month"
        >
          <MinorTick visible={false} />
          <Marker visible={false} />
          <Label format="MMM" />
        </Scale>
        <Behavior valueChangeMode={behaviorMode} />
        <SliderMarker format="dd EEEE" />
      </RangeSelector>
      <h2>Working days count: {workingDaysCount}</h2>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <span>Handle Range Changes </span>
          <SelectBox
            dataSource={behaviorModes}
            width={210}
            inputAttr={valueChangeModeLabel}
            value={behaviorMode}
            onValueChanged={setBehavior}
          />
        </div>
      </div>
    </div>
  );
}
function calculateWorkdays([start, end]) {
  const currentDate = new Date(start);
  let workingDaysCount = 0;
  while (currentDate <= end) {
    if (currentDate.getDay() > 0 && currentDate.getDay() < 6) {
      workingDaysCount += 1;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return workingDaysCount;
}
export default App;
