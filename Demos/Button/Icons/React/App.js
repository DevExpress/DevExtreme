import React from 'react';
import { Button } from 'devextreme-react/button';
import notify from 'devextreme/ui/notify';

class App extends React.Component {
  weatherClick() {
    notify('The Weather button was clicked');
  }

  doneClick() {
    notify('The Done button was clicked');
  }

  sendClick() {
    notify('The Send button was clicked');
  }

  plusClick() {
    notify('The button was clicked');
  }

  backClick() {
    notify('The button was clicked');
  }

  render() {
    return (
      <div>
        <div className="dx-fieldset">
          <div className="fields-container">
            <div className="dx-field">
              <div className="dx-field-label">Built-in icon</div>
              <div className="dx-field-value">
                <Button icon="check"
                  type="success"
                  text="Done"
                  onClick={this.doneClick} />
              </div>
            </div>
            <div className="dx-field">
              <div className="dx-field-label">Image icon</div>
              <div className="dx-field-value">
                <Button icon="../../../../images/icons/weather.png"
                  text="Weather"
                  onClick={this.weatherClick} />
              </div>
            </div>
            <div className="dx-field">
              <div className="dx-field-label">External icon</div>
              <div className="dx-field-value">
                <Button className="send"
                  icon="fa fa-envelope-o"
                  text="Send"
                  onClick={this.sendClick} />
              </div>
            </div>
            <div className="dx-field">
              <div className="dx-field-label">Icon only</div>
              <div className="dx-field-value">
                <Button icon="plus"
                  onClick={this.plusClick} />
                <Button icon="back"
                  id="icon-back"
                  onClick={this.backClick} />
              </div>
            </div>
          </div>
        </div>
        <div className="dx-fieldset">
          <div className="dx-fieldset-header">DISABLED</div>
          <div className="fields-container">
            <div className="dx-field">
              <div className="dx-field-value">
                <Button icon="check"
                  type="success"
                  text="Done"
                  disabled={true} />
              </div>
            </div>
            <div className="dx-field">
              <div className="dx-field-value">
                <Button icon="../../../../images/icons/weather.png"
                  text="Weather"
                  disabled={true} />
              </div>
            </div>
            <div className="dx-field">
              <div className="dx-field-value">
                <Button className="send"
                  icon="fa fa-envelope-o"
                  text="Send"
                  disabled={true} />
              </div>
            </div>
            <div className="dx-field">
              <div className="dx-field-value">
                <Button icon="plus"
                  disabled={true} />
                <Button icon="back"
                  id="icon-disabled-back"
                  disabled={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
