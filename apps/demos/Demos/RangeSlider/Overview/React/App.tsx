import React, { useCallback, useState } from 'react';
import RangeSlider, { Tooltip, Label } from 'devextreme-react/range-slider';
import type { RangeSliderTypes } from 'devextreme-react/range-slider';
import NumberBox from 'devextreme-react/number-box';
import type { NumberBoxTypes } from 'devextreme-react/number-box';

const defaultValues = {
  defaultMode: [20, 60],
  labels: [35, 65],
  tooltips: [15, 65],
  withoutRangeHighlighting: [20, 80],
  discreteStep: [20, 70],
  disabled: [25, 75],
} satisfies Record<string, [number, number]>;

const startValueLabel = { 'aria-label': 'Start Value' };
const endValueLabel = { 'aria-label': 'End Value' };

function format(value: number): string {
  return `${value}%`;
}

function App() {
  const [startValue, setStartValue] = useState<number>(10);
  const [endValue, setEndValue] = useState<number>(90);

  const onRangeChanged = useCallback((data: RangeSliderTypes.ValueChangedEvent): void => {
    setStartValue(data.start);
    setEndValue(data.end);
  }, []);

  const onStartChanged = useCallback((data: NumberBoxTypes.ValueChangedEvent): void => {
    setStartValue(data.value);
  }, []);

  const onEndChanged = useCallback((data: NumberBoxTypes.ValueChangedEvent): void => {
    setEndValue(data.value);
  }, []);

  return (
    <div className="form">
      <div className="dx-fieldset">
        <div className="dx-field">
          <div className="dx-field-label">Default mode</div>
          <div className="dx-field-value">
            <RangeSlider min={0} max={100} defaultValue={defaultValues.defaultMode} />
          </div>
        </div>
        <div className="dx-field custom-height-slider">
          <div className="dx-field-label">With labels</div>
          <div className="dx-field-value">
            <RangeSlider min={0} max={100} defaultValue={defaultValues.labels}>
              <Label visible={true} format={format} position="top" />
            </RangeSlider>
          </div>
        </div>
        <div className="dx-field custom-height-slider">
          <div className="dx-field-label">With tooltips</div>
          <div className="dx-field-value">
            <RangeSlider min={0} max={100} defaultValue={defaultValues.tooltips}>
              <Tooltip enabled={true} format={format} showMode="always" position="bottom" />
            </RangeSlider>
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Without range highlighting</div>
          <div className="dx-field-value">
            <RangeSlider
              min={0}
              max={100}
              defaultValue={defaultValues.withoutRangeHighlighting}
              showRange={false} />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">With discrete step</div>
          <div className="dx-field-value">
            <RangeSlider min={0} max={100} defaultValue={defaultValues.discreteStep} step={10}>
              <Tooltip enabled={true} />
            </RangeSlider>
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Disabled</div>
          <div className="dx-field-value">
            <RangeSlider
              min={0}
              max={100}
              defaultValue={defaultValues.disabled}
              disabled={true} />
          </div>
        </div>
      </div>
      <div className="dx-fieldset">
        <div className="dx-fieldset-header">Process Value Changes</div>
        <div className="dx-field">
          <div className="dx-field-label">On handle movement</div>
          <div className="dx-field-value">
            <RangeSlider
              min={0}
              max={100}
              start={startValue}
              end={endValue}
              onValueChanged={onRangeChanged} />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">On handle release</div>
          <div className="dx-field-value">
            <RangeSlider
              min={0}
              max={100}
              start={startValue}
              end={endValue}
              valueChangeMode="onHandleRelease"
              onValueChanged={onRangeChanged} />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">Start value</div>
          <div className="dx-field-value">
            <NumberBox
              value={startValue}
              min={0}
              max={100}
              showSpinButtons={true}
              inputAttr={startValueLabel}
              onValueChanged={onStartChanged} />
          </div>
        </div>
        <div className="dx-field">
          <div className="dx-field-label">End value</div>
          <div className="dx-field-value">
            <NumberBox
              value={endValue}
              min={0}
              max={100}
              showSpinButtons={true}
              inputAttr={endValueLabel}
              onValueChanged={onEndChanged} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
