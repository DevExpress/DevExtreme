import React from 'react';

import { Tooltip } from 'devextreme-react/tooltip';

const animationConfig = {
  show: {
    type: 'slide',
    from: {
      top: -100,
      opacity: 0
    },
    to: {
      top: 0,
      opacity: 1
    }
  },
  hide: {
    type: 'pop',
    from: {
      scale: 1,
      opacity: 1
    },
    to: {
      scale: 0.1,
      opacity: 0
    }
  }
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultVisible: false,
      withAnimationVisible: false,
      withTemplateVisible: false
    };

    this.toggleDefault = this.toggleDefault.bind(this);
    this.toggleWithTemplate = this.toggleWithTemplate.bind(this);
    this.toggleWithAnimation = this.toggleWithAnimation.bind(this);
  }
  render() {
    return (
      <div className="form">

        <div className="label">Default mode</div>
        <div>
          <img
            id="product1"
            src="../../../../images/products/17.png"
            onMouseEnter={this.toggleDefault}
            onMouseLeave={this.toggleDefault}
          />

          <Tooltip
            target="#product1"
            visible={this.state.defaultVisible}
            closeOnOutsideClick={false}
          >
            <div>ExcelRemote IR</div>
          </Tooltip>
        </div>

        <div className="label">With template</div>
        <div>
          <img
            id="product2"
            src="../../../../images/products/3.png"
            onMouseEnter={this.toggleWithTemplate}
            onMouseLeave={this.toggleWithTemplate}
          />

          <Tooltip
            target="#product2"
            position="right"
            visible={this.state.withTemplateVisible}
            closeOnOutsideClick={false}
          >
            <img width="150" src="../../../../images/products/3.png" /><br />
            <b>SuperPlasma 50</b><br /> 2400$
          </Tooltip>
        </div>

        <div className="label">With animation</div>
        <div>
          <img
            id="product3"
            src="../../../../images/products/15.png"
            onMouseEnter={this.toggleWithAnimation}
            onMouseLeave={this.toggleWithAnimation}
          />

          <Tooltip
            target="#product3"
            position="top"
            animation={animationConfig}
            visible={this.state.withAnimationVisible}
            closeOnOutsideClick={false}
          >
            <div>Projector PlusHD</div>
          </Tooltip>
        </div>

      </div>
    );
  }

  toggleDefault() {
    this.setState({
      defaultVisible: !this.state.defaultVisible
    });
  }

  toggleWithTemplate() {
    this.setState({
      withTemplateVisible: !this.state.withTemplateVisible
    });
  }

  toggleWithAnimation() {
    this.setState({
      withAnimationVisible: !this.state.withAnimationVisible
    });
  }
}

export default App;
