import React from 'react';
import { Button } from 'devextreme-react';
import notify from 'devextreme/ui/notify';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  onClick(e) {
    const buttonText = e.component.option('text');
    notify(`The ${capitalize(buttonText)} button was clicked`);
  }

  render() {
    return (
      <div className="buttons-demo">
        <div className="buttons">
          <div>
            <div className="buttons-column">
              <div className="column-header">
                Normal
              </div>
              <div>
                <Button
                  width={120}
                  text="Contained"
                  type="normal"
                  stylingMode="contained"
                  onClick={this.onClick}
                />
              </div>
              <div>
                <Button
                  width={120}
                  text="Outlined"
                  type="normal"
                  stylingMode="outlined"
                  onClick={this.onClick}
                />
              </div>
              <div>
                <Button
                  width={120}
                  text="Text"
                  type="normal"
                  stylingMode="text"
                  onClick={this.onClick}
                />
              </div>
            </div>
            <div className="buttons-column">
              <div className="column-header">
                Success
              </div>
              <div>
                <Button
                  width={120}
                  text="Contained"
                  type="success"
                  stylingMode="contained"
                  onClick={this.onClick}
                />
              </div>
              <div>
                <Button
                  width={120}
                  text="Outlined"
                  type="success"
                  stylingMode="outlined"
                  onClick={this.onClick}
                />
              </div>
              <div>
                <Button
                  width={120}
                  text="Text"
                  type="success"
                  stylingMode="text"
                  onClick={this.onClick}
                />
              </div>
            </div>
          </div>
          <div>
            <div className="buttons-column">
              <div className="column-header">
                Default
              </div>
              <div>
                <Button
                  width={120}
                  text="Contained"
                  type="default"
                  stylingMode="contained"
                  onClick={this.onClick}
                />
              </div>
              <div>
                <Button
                  width={120}
                  text="Outlined"
                  type="default"
                  stylingMode="outlined"
                  onClick={this.onClick}
                />
              </div>
              <div>
                <Button
                  width={120}
                  text="Text"
                  type="default"
                  stylingMode="text"
                  onClick={this.onClick}
                />
              </div>
            </div>
            <div className="buttons-column">
              <div className="column-header">
                Danger
              </div>
              <div>
                <Button
                  width={120}
                  text="Contained"
                  type="danger"
                  stylingMode="contained"
                  onClick={this.onClick}
                />
              </div>
              <div>
                <Button
                  width={120}
                  text="Outlined"
                  type="danger"
                  stylingMode="outlined"
                  onClick={this.onClick}
                />
              </div>
              <div>
                <Button
                  width={120}
                  text="Text"
                  type="danger"
                  stylingMode="text"
                  onClick={this.onClick}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default App;
