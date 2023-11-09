import React from 'react';
import {
  CircularGauge, Scale, Label, Tooltip, Title, Font,
} from 'devextreme-react/circular-gauge';
import { NumberBox } from 'devextreme-react/number-box';
import { Button } from 'devextreme-react/button';

const mainGeneratorLabel = { 'aria-label': 'Main Generator' };
const additionalGeneratorOneLabel = { 'aria-label': 'Additional Generator One' };
const additionalGeneratorTwoLabel = { 'aria-label': 'Additional Generator Two' };

function customizeText({ valueText }) {
  return `${valueText} kV`;
}

function App() {
  const [mainGeneratorValue, setMainGeneratorValue] = React.useState(34);
  const [additionalGenerator1Value, setAdditionalGenerator1Value] = React.useState(12);
  const [additionalGenerator2Value, setAdditionalGenerator2Value] = React.useState(23);
  const gaugeRef = React.useRef(null);

  const updateValues = React.useCallback(() => {
    const gauge = gaugeRef.current.instance;
    gauge.value(mainGeneratorValue);
    gauge.subvalues([additionalGenerator1Value, additionalGenerator2Value]);
  }, [
    gaugeRef,
    mainGeneratorValue,
    additionalGenerator1Value,
    additionalGenerator2Value,
  ]);

  const defaultSubvalues = React.useMemo(
    () => [additionalGenerator1Value, additionalGenerator2Value],
    [additionalGenerator1Value, additionalGenerator2Value],
  );

  return (
    <div id="gauge-demo">
      <div className="widget-container">
        <CircularGauge
          id="gauge"
          defaultValue={mainGeneratorValue}
          defaultSubvalues={defaultSubvalues}
          ref={gaugeRef}
        >
          <Scale startValue={10} endValue={40} tickInterval={5}>
            <Label customizeText={customizeText} />
          </Scale>
          <Tooltip enabled={true} />
          <Title text="Generators Voltage (kV)">
            <Font size={28} />
          </Title>
        </CircularGauge>
      </div>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <span>Main generator</span>&nbsp;
          <NumberBox
            id="main-generator"
            value={mainGeneratorValue}
            onValueChange={setMainGeneratorValue}
            min={10}
            max={40}
            width={100}
            showSpinButtons={true}
            inputAttr={mainGeneratorLabel}
          />
        </div>
        <div className="option">
          <span>Additional generator 1</span>&nbsp;
          <NumberBox
            id="additional-generator-one"
            value={additionalGenerator1Value}
            onValueChange={setAdditionalGenerator1Value}
            min={10}
            max={40}
            width={100}
            showSpinButtons={true}
            inputAttr={additionalGeneratorOneLabel}
          />
        </div>
        <div className="option">
          <span>Additional generator 2</span>&nbsp;
          <NumberBox
            id="additional-generator-two"
            value={additionalGenerator2Value}
            onValueChange={setAdditionalGenerator2Value}
            min={10}
            max={40}
            width={100}
            showSpinButtons={true}
            inputAttr={additionalGeneratorTwoLabel}
          />
        </div>
        <div className="option">
          <Button
            id="edit"
            width={100}
            text="Apply"
            onClick={updateValues}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
