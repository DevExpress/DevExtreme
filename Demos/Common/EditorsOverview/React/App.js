import React from 'react';

import ColorBox from 'devextreme-react/color-box';
import NumberBox from 'devextreme-react/number-box';
import SelectBox from 'devextreme-react/select-box';
import Switch from 'devextreme-react/switch';
import TextBox from 'devextreme-react/text-box';

import Logo from './Logo.js';

const widthLabel = { 'aria-label': 'Width' };
const heightLabel = { 'aria-label': 'Height' };
const titleLabel = { 'aria-label': 'Title' };

const noFlipTransform = 'scaleX(1)';
const transformations = [
  {
    key: 'Flip',
    items: [
      { name: '0 degrees', value: noFlipTransform },
      { name: '180 degrees', value: 'scaleX(-1)' },
    ],
  },
  {
    key: 'Rotate',
    items: [
      { name: '0 degrees', value: 'rotate(0)' },
      { name: '15 degrees', value: 'rotate(15deg)' },
      { name: '30 degrees', value: 'rotate(30deg)' },
      { name: '-15 degrees', value: 'rotate(-15deg)' },
      { name: '-30 degrees', value: 'rotate(-30deg)' },
    ],
  },
];

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: 'UI Superhero',
      width: 370,
      height: 260,
      color: '#f05b41',
      transform: noFlipTransform,
      border: false,
    };

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
    this.handleWidthChange = this.handleWidthChange.bind(this);
    this.handleHeightChange = this.handleHeightChange.bind(this);
    this.handleTransformChange = this.handleTransformChange.bind(this);
    this.handleBorderChange = this.handleBorderChange.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <div className="settings">
          <div className="column">
            <div className="field">
              <div className="label">Title</div>
              <div className="value">
                <TextBox
                  value={this.state.text}
                  inputAttr={titleLabel}
                  onValueChanged={this.handleTextChange}
                  maxLength={40}
                  valueChangeEvent="keyup"
                />
              </div>
            </div>
            <div className="field">
              <div className="label">Color</div>
              <div className="value">
                <ColorBox
                  value={this.state.color}
                  onValueChanged={this.handleColorChange}
                  applyValueMode="instantly"
                />
              </div>
            </div>
          </div>
          <div className="column">
            <div className="field">
              <div className="label">Width</div>
              <div className="value">
                <NumberBox
                  value={this.state.width}
                  onValueChanged={this.handleWidthChange}
                  showSpinButtons={true}
                  max={700}
                  min={70}
                  format="#0px"
                  inputAttr={widthLabel}
                />
              </div>
            </div>
            <div className="field">
              <div className="label">Height</div>
              <div className="value">
                <NumberBox
                  value={this.state.height}
                  onValueChanged={this.handleHeightChange}
                  showSpinButtons={true}
                  max={700}
                  min={70}
                  format="#0px"
                  inputAttr={heightLabel}
                />
              </div>
            </div>
          </div>
          <div className="column">
            <div className="field">
              <div className="label">Transform</div>
              <div className="value">
                <SelectBox
                  value={this.state.transform}
                  onValueChanged={this.handleTransformChange}
                  items={transformations}
                  grouped={true}
                  displayExpr="name"
                  valueExpr="value"
                />
              </div>
            </div>

            <div className="field">
              <div className="label">Border</div>
              <div className="value">
                <Switch
                  value={this.state.border}
                  onValueChanged={this.handleBorderChange}
                />
              </div>
            </div>
          </div>
        </div>

        <Logo
          text={this.state.text}
          width={this.state.width}
          height={this.state.height}
          color={this.state.color}
          transform={this.state.transform}
          border={this.state.border}
        />
      </React.Fragment>
    );
  }

  handleTextChange(e) {
    this.setState({
      text: e.value,
    });
  }

  handleColorChange(e) {
    this.setState({
      color: e.value,
    });
  }

  handleHeightChange(e) {
    this.setState({
      width: (e.value * 37) / 26,
      height: e.value,
    });
  }

  handleWidthChange(e) {
    this.setState({
      width: e.value,
      height: (e.value * 26) / 37,
    });
  }

  handleTransformChange(e) {
    this.setState({
      transform: e.value,
    });
  }

  handleBorderChange(e) {
    this.setState({
      border: e.value,
    });
  }
}

export default App;
