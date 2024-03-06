import React, { useCallback, useState } from 'react';
import SelectBox from 'devextreme-react/select-box';
import PieChart, {
  Series,
  Label,
  Margin,
  Export,
  Legend,
  Animation,
} from 'devextreme-react/pie-chart';
import { dataSource, resolutionModeLabel } from './data.js';

const resolveModes = ['shift', 'hide', 'none'];
function formatText(arg) {
  return `${arg.argumentText} (${arg.percentText})`;
}
function App() {
  const [resolveMode, setResolveMode] = useState(resolveModes[0]);
  const handleResolveModeChange = useCallback(
    (data) => {
      setResolveMode(data.value);
    },
    [setResolveMode],
  );
  return (
    <React.Fragment>
      <PieChart
        id="pie"
        dataSource={dataSource}
        palette="Bright"
        title="Olympic Medals in 2008"
        resolveLabelOverlapping={resolveMode}
      >
        <Series
          argumentField="country"
          valueField="medals"
        >
          <Label
            visible={true}
            customizeText={formatText}
          />
        </Series>
        <Margin bottom={20} />
        <Export enabled={true} />
        <Legend visible={false} />
        <Animation enabled={false} />
      </PieChart>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <span>Label Overlapping Resolution Mode </span>
          <SelectBox
            dataSource={resolveModes}
            inputAttr={resolutionModeLabel}
            value={resolveMode}
            onValueChanged={handleResolveModeChange}
          />
        </div>
      </div>
    </React.Fragment>
  );
}
export default App;
