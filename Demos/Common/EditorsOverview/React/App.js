import React from 'react';

import ColorBox from 'devextreme-react/color-box';
import NumberBox from 'devextreme-react/number-box';
import SelectBox from 'devextreme-react/select-box';
import Switch from 'devextreme-react/switch';
import TextBox from 'devextreme-react/text-box';

import Logo from './Logo.js';

const colorLabel = { 'aria-label': 'Color' };
const widthLabel = { 'aria-label': 'Width' };
const heightLabel = { 'aria-label': 'Height' };
const titleLabel = { 'aria-label': 'Title' };
const transformLabel = { 'aria-label': 'Transform' };

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

function App() {
  const [text, setText] = React.useState('UI Superhero');
  const [width, setWidth] = React.useState(370);
  const [height, setHeight] = React.useState(260);
  const [color, setColor] = React.useState('#f05b41');
  const [transform, setTransform] = React.useState(noFlipTransform);
  const [border, setBorder] = React.useState(false);

  const handleTextChange = React.useCallback((e) => {
    setText(e.value);
  }, []);

  const handleColorChange = React.useCallback((e) => {
    setColor(e.value);
  }, []);

  const handleHeightChange = React.useCallback((e) => {
    setWidth((e.value * 37) / 26);
    setHeight(e.value);
  }, []);

  const handleWidthChange = React.useCallback((e) => {
    setWidth(e.value);
    setHeight((e.value * 26) / 37);
  }, []);

  const handleTransformChange = React.useCallback((e) => {
    setTransform(e.value);
  }, []);

  const handleBorderChange = React.useCallback((e) => {
    setBorder(e.value);
  }, []);

  return (
    <React.Fragment>
      <div className="settings">
        <div className="column">
          <div className="field">
            <div className="label">Title</div>
            <div className="value">
              <TextBox
                value={text}
                inputAttr={titleLabel}
                onValueChanged={handleTextChange}
                maxLength={40}
                valueChangeEvent="keyup"
              />
            </div>
          </div>
          <div className="field">
            <div className="label">Color</div>
            <div className="value">
              <ColorBox
                value={color}
                onValueChanged={handleColorChange}
                applyValueMode="instantly"
                inputAttr={colorLabel}
              />
            </div>
          </div>
        </div>
        <div className="column">
          <div className="field">
            <div className="label">Width</div>
            <div className="value">
              <NumberBox
                value={width}
                onValueChanged={handleWidthChange}
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
                value={height}
                onValueChanged={handleHeightChange}
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
                value={transform}
                onValueChanged={handleTransformChange}
                inputAttr={transformLabel}
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
              <Switch value={border} onValueChanged={handleBorderChange} />
            </div>
          </div>
        </div>
      </div>

      <Logo
        text={text}
        width={width}
        height={height}
        color={color}
        transform={transform}
        border={border}
      />
    </React.Fragment>
  );
}

export default App;
