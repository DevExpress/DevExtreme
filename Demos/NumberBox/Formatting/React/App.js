import React from 'react';
import NumberBox from 'devextreme-react/number-box';

const integerFormatLabel = { 'aria-label': 'Integer Format' };
const currencyFormatLabel = { 'aria-label': 'Currency Format' };
const accountingFormatLabel = { 'aria-label': 'Accounting Format' };
const percentFormatLabel = { 'aria-label': 'Percent Format' };
const fixedPointFormatLabel = { 'aria-label': 'Fixed Poing Format' };
const weightFormatLabel = { 'aria-label': 'Weight Format' };

class App extends React.Component {
  render() {
    return (
      <div>
        <div className="dx-fieldset">
          <div className="dx-field">
            <div className="dx-field-label">Integer format</div>
            <div className="dx-field-value">
              <NumberBox
                format="#"
                inputAttr={integerFormatLabel}
                defaultValue={14500} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Currency format</div>
            <div className="dx-field-value">
              <NumberBox
                format="$ #,##0.##"
                inputAttr={currencyFormatLabel}
                defaultValue={14500.55} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Accounting format</div>
            <div className="dx-field-value">
              <NumberBox
                format="$ #,##0.##;($ #,##0.##)"
                inputAttr={accountingFormatLabel}
                defaultValue={-2314.12} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Percent format</div>
            <div className="dx-field-value">
              <NumberBox
                format="#0%"
                inputAttr={percentFormatLabel}
                defaultValue={0.15}
                step={0.01} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Fixed point format</div>
            <div className="dx-field-value">
              <NumberBox
                format="#,##0.00"
                inputAttr={fixedPointFormatLabel}
                defaultValue={13415.24} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Weight format</div>
            <div className="dx-field-value">
              <NumberBox
                format="#0.## kg"
                inputAttr={weightFormatLabel}
                defaultValue={3.14} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
