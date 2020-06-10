import React from 'react';

import { Button } from 'devextreme-react/button';
import { LoadIndicator } from 'devextreme-react/load-indicator';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loadIndicatorVisible: false,
      buttonText: 'Send'
    };

    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    return (
      <div className="form">
        <div className="label">Custom size</div>

        <LoadIndicator id="small-indicator" height={20} width={20} />
        <LoadIndicator id="medium-indicator" height={40} width={40} />
        <LoadIndicator id="large-indicator" height={60} width={60} />

        <div className="label">Custom image</div>

        <LoadIndicator id="image-indicator" indicatorSrc="../../../../images/Loading.gif" />

        <div className="label">Using with other widgets</div>

        <Button
          id="button"
          width={180}
          height={40}
          onClick={this.handleClick}
        >
          <LoadIndicator className="button-indicator" visible={this.state.loadIndicatorVisible} />
          <span className="dx-button-text">{this.state.buttonText}</span>
        </Button>
      </div>
    );
  }

  handleClick() {
    this.setState(
      {
        loadIndicatorVisible: true,
        buttonText: 'Sending'
      },
      () => {
        setTimeout(() => {
          this.setState({
            loadIndicatorVisible: false,
            buttonText: 'Send'
          });
        }, 2000);
      }
    );
  }
}

export default App;
