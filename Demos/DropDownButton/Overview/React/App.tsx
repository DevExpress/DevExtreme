import React, { useCallback, useMemo, useState } from 'react';
import DropDownButton, { DropDownButtonTypes } from 'devextreme-react/drop-down-button';
import Toolbar from 'devextreme-react/toolbar';
import { Template } from 'devextreme-react/core/template';
import { ButtonTypes } from 'devextreme-react/button';
import notify from 'devextreme/ui/notify';
import service from './data.ts';
import ColorIcon from './ColorIcon.tsx';
import 'whatwg-fetch';

type TextAlign = 'center' | 'end' | 'justify' | 'left' | 'match-parent' | 'right' | 'start';

const buttonDropDownOptions = { width: 230 };

const data = service.getData();

const itemTemplateRender = (item) => (
  <div style={{ fontSize: `${item.size}px` }}>
    {item.text}
  </div>
);

const App = () => {
  const [alignment, setAlignment] = useState<TextAlign>('left');
  const [color, setColor] = useState(null);
  const [fontSize, setFontSize] = useState(14);
  const [lineHeight, setLineHeight] = useState(1.35);
  const [colorPicker, setColorPicker] = useState(null);

  const onButtonClick = useCallback((e: ButtonTypes.ClickEvent) => {
    notify(`Go to ${e.component.option('text')}'s profile`, 'success', 600);
  }, []);

  const onItemClick = useCallback((e: DropDownButtonTypes.ItemClickEvent) => {
    notify(e.itemData.name || e.itemData, 'success', 600);
  }, []);

  const onColorClick = useCallback((selectedColor) => {
    setColor(selectedColor);
    const squareIcon = colorPicker.element().getElementsByClassName('dx-icon-square')[0];
    squareIcon.style.color = selectedColor;
    colorPicker.close();
  }, [colorPicker]);

  const onInitialized = useCallback((e: DropDownButtonTypes.InitializedEvent) => {
    setColorPicker(e.component);
  }, [setColorPicker]);

  const toolbarItems = useMemo(() => [
    {
      location: 'before',
      widget: 'dxDropDownButton',
      options: {
        displayExpr: 'name',
        keyExpr: 'id',
        selectedItemKey: 3,
        width: 125,
        stylingMode: 'text',
        useSelectMode: true,
        onSelectionChanged: (e) => {
          setAlignment(e.item.name.toLowerCase());
        },
        items: data.alignments,
      },
    },
    {
      location: 'before',
      widget: 'dxDropDownButton',
      options: {
        items: data.colors,
        icon: 'square',
        stylingMode: 'text',
        dropDownOptions: { width: 'auto' },
        onInitialized,
        dropDownContentTemplate: 'colorpicker',
      },
    },
    {
      location: 'before',
      widget: 'dxDropDownButton',
      options: {
        stylingMode: 'text',
        displayExpr: 'text',
        keyExpr: 'size',
        useSelectMode: true,
        items: data.fontSizes,
        selectedItemKey: 14,
        onSelectionChanged: (e: DropDownButtonTypes.SelectionChangedEvent) => {
          setFontSize(e.item.size);
        },
        itemTemplate: 'fontItem',
      },
    },
    {
      location: 'before',
      widget: 'dxDropDownButton',
      options: {
        stylingMode: 'text',
        icon: 'indent',
        displayExpr: 'text',
        keyExpr: 'lineHeight',
        useSelectMode: true,
        items: data.lineHeights,
        selectedItemKey: 1.35,
        onSelectionChanged: (e: DropDownButtonTypes.SelectionChangedEvent) => {
          setLineHeight(e.item.lineHeight);
        },
      },
    },
  ], [setAlignment, setFontSize, setLineHeight, onInitialized]);

  return (
    <div>
      <div className="dx-fieldset">
        <div className="dx-fieldset-header">Single usage</div>
        <div className="dx-field">
          <div className="dx-field-label">
            Custom static text
          </div>
          <div className="dx-field-value">
            <DropDownButton
              text="Download Trial"
              icon="save"
              dropDownOptions={buttonDropDownOptions}
              items={data.downloads}
              onItemClick={onItemClick}
            />
          </div>
        </div>

        <div className="dx-field">
          <div className="dx-field-label">
            Custom main button action
          </div>
          <div className="dx-field-value">
            <DropDownButton
              splitButton={true}
              useSelectMode={false}
              text="Sandra Johnson"
              icon="../../../../images/gym/coach-woman.png"
              items={data.profileSettings}
              displayExpr="name"
              keyExpr="id"
              onButtonClick={onButtonClick}
              onItemClick={onItemClick}
            />
          </div>
        </div>
      </div>

      <div className="dx-fieldset">
        <div className="dx-fieldset-header">Usage in a toolbar</div>
        <div className="dx-field">
          <Toolbar items={toolbarItems}>
            <Template name="colorpicker">
              <div className="custom-color-picker">
                {data.colors.map((colorValue, i) => (
                  <ColorIcon key={i} color={colorValue} onClick={onColorClick} />
                ))}
              </div>
            </Template>
            <Template name="fontItem" render={itemTemplateRender}>
            </Template>
          </Toolbar>
        </div>
        <div className={color ? 'dx-field' : 'dx-field dx-theme-text-color'} style={{
          color,
          textAlign: alignment,
          lineHeight,
          fontSize: `${fontSize}px`,
        }}>
          <p id="text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>
      </div>
    </div>
  );
};

export default App;
