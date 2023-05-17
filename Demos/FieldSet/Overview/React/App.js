import React from 'react';
import TextBox from 'devextreme-react/text-box';
import TextArea from 'devextreme-react/text-area';

const notesLabel = { 'aria-label': 'Notes' };
const addressLabel = { 'aria-label': 'Address' };
const cityLabel = { 'aria-label': 'City' };

class App extends React.Component {
  render() {
    return (
      <div className="form">
        <div className="dx-fieldset">
          <div className="dx-fieldset-header">Simple Field Set</div>
          <div className="dx-field">
            <div className="dx-field-label">Full Name</div>
            <div className="dx-field-value-static">Kevin Carter</div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Position</div>
            <div className="dx-field-value-static">Shipping Manager</div>
          </div>
        </div>
        <div className="dx-fieldset">
          <div className="dx-fieldset-header">Field Set with DevExtreme Widgets</div>
          <div className="dx-field">
            <div className="dx-field-label">Address</div>
            <TextBox inputAttr={addressLabel} className="dx-field-value" defaultValue="424 N Main St." />
          </div>
          <div className="dx-field">
            <div className="dx-field-label">City</div>
            <TextBox inputAttr={cityLabel} className="dx-field-value" defaultValue="San Diego" />
          </div>
        </div>
        <div className="dx-fieldset" id="notes-container">
          <div className="dx-fieldset-header">Field Set with Custom Value Width</div>
          <div className="dx-field">
            <div className="dx-field-label">Notes</div>
            <TextArea className="dx-field-value" inputAttr={notesLabel} height={80} defaultValue="Kevin is our hard-working shipping manager and has been helping that department work like clockwork for 18 months. When not in the office, he is usually on the basketball court playing pick-up games." />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
