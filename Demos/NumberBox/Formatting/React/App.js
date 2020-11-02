import React from 'react';
import NumberBox from 'devextreme-react/number-box';

class App extends React.Component {
  render() {
    return (
      <div>
        <div className="dx-fieldset">
          <div className="dx-field">
            <div className="dx-field-label">Currency format</div>
            <div className="dx-field-value">
              <NumberBox
                format="$ #,##0.##"
                defaultValue={14500.55} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Accounting format</div>
            <div className="dx-field-value">
              <NumberBox
                format="$ #,##0.##;($ #,##0.##)"
                defaultValue={-2314.12} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Percent format</div>
            <div className="dx-field-value">
              <NumberBox
                format="#0%"
                defaultValue={0.15}
                step={0.01} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Fixed point format</div>
            <div className="dx-field-value">
              <NumberBox
                format="#,##0.00"
                defaultValue={13415.24} />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Weight format</div>
            <div className="dx-field-value">
              <NumberBox
                format="#0.## kg"
                defaultValue={3.14} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
