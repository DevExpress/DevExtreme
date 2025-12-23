import React, { useCallback, useState } from 'react';

import ColorBox from 'devextreme-react/color-box';
import type { ColorBoxTypes } from 'devextreme-react/color-box';
import NumberBox from 'devextreme-react/number-box';
import type { NumberBoxTypes } from 'devextreme-react/number-box';
import SelectBox from 'devextreme-react/select-box';
import type { SelectBoxTypes } from 'devextreme-react/select-box';
import Switch from 'devextreme-react/switch';
import type { SwitchTypes } from 'devextreme-react/switch';
import TextBox from 'devextreme-react/text-box';
import type { TextBoxTypes } from 'devextreme-react/text-box';

import Logo from './Logo.tsx';

const colorLabel = { 'aria-label': 'Color' };
const widthLabel = { 'aria-label': 'Width' };
const heightLabel = { 'aria-label': 'Height' };
const titleLabel = { 'aria-label': 'Title' };
const transformLabel = { 'aria-label': 'Transform' };

const noFlipTransform = 'scaleX(1)';
const transformations: { key: string, items: { name: string, value: string }[] }[] = [
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
  const [text, setText] = useState<string>('UI Superhero');
  const [width, setWidth] = useState<number>(370);
  const [height, setHeight] = useState<number>(260);
  const [color, setColor] = useState<string>('#f05b41');
  const [transform, setTransform] = useState<string>(noFlipTransform);
  const [border, setBorder] = useState<boolean>(false);

  const handleTextChange = useCallback(({ value }: TextBoxTypes.ValueChangedEvent): void => {
    setText(value);
  }, []);

  const handleColorChange = useCallback(({ value }: ColorBoxTypes.ValueChangedEvent): void => {
    setColor(value);
  }, []);

  const handleHeightChange = useCallback(({ value }: NumberBoxTypes.ValueChangedEvent): void => {
    setWidth((value * 37) / 26);
    setHeight(value);
  }, []);

  const handleWidthChange = useCallback(({ value }: NumberBoxTypes.ValueChangedEvent): void => {
    setWidth(value);
    setHeight((value * 26) / 37);
  }, []);

  const handleTransformChange = useCallback(({ value }: SelectBoxTypes.ValueChangedEvent): void => {
    setTransform(value);
  }, []);

  const handleBorderChange = useCallback(({ value }: SwitchTypes.ValueChangedEvent): void => {
    setBorder(value);
  }, []);

  return (
    <>
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
              <Switch
                value={border}
                onValueChanged={handleBorderChange}
              />
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
    </>
  );
}

export default App;
