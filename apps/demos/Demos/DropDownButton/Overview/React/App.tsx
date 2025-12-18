import React, { useCallback, useMemo, useState } from 'react';
import DropDownButton from 'devextreme-react/drop-down-button';
import type { DropDownButtonTypes, DropDownButtonRef } from 'devextreme-react/drop-down-button';
import Toolbar from 'devextreme-react/toolbar';
import type { ToolbarTypes } from 'devextreme-react/toolbar';
import { Template } from 'devextreme-react/core/template';
import type { ButtonTypes } from 'devextreme-react/button';
import notify from 'devextreme/ui/notify';
import {
  colors,
  downloads,
  alignments,
  profileSettings,
  fontSizes,
  lineHeights,
} from './data.ts';
import type { TextAlign } from './types.ts';
import ColorIcon from './ColorIcon.tsx';
import DropDownButtonTemplate from './DropDownButtonTemplate.tsx';
import 'whatwg-fetch';

const buttonDropDownOptions = { width: 230 };

const itemTemplateRender: React.FC<{ size: number; text: string }> = (item) => (
  <div style={{ fontSize: `${item.size}px` }}>
    {item.text}
  </div>
);
const App = () => {
  const [alignment, setAlignment] = useState<TextAlign>('left');
  const [color, setColor] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<number>(14);
  const [lineHeight, setLineHeight] = useState<number>(1.35);

  type ColorPicker = ReturnType<DropDownButtonRef['instance']>;
  const [colorPicker, setColorPicker] = useState<ColorPicker | undefined>(undefined);

  const onButtonClick = useCallback((e: ButtonTypes.ClickEvent): void => {
    notify(`Go to ${e.element.querySelector('.button-title').textContent}'s profile`, 'success', 600);
  }, []);

  const onItemClick = useCallback((e: DropDownButtonTypes.ItemClickEvent): void => {
    notify(e.itemData.name || e.itemData, 'success', 600);
  }, []);

  const onColorClick = useCallback((selectedColor: string): void => {
    setColor(selectedColor);
    const squareIcon = colorPicker?.element().getElementsByClassName('dx-icon-square')[0] as HTMLElement;
    squareIcon.style.color = selectedColor;
    colorPicker?.close();
  }, [colorPicker]);

  const onInitialized = useCallback((e: DropDownButtonTypes.InitializedEvent): void => {
    setColorPicker(e.component);
  }, []);

  const toolbarItems = useMemo((): ToolbarTypes.Item[] => [
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
        onSelectionChanged: (e: any): void => {
          setAlignment(e.item.name.toLowerCase());
        },
        items: alignments,
      },
    },
    {
      location: 'before',
      widget: 'dxDropDownButton',
      options: {
        items: colors,
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
        items: fontSizes,
        selectedItemKey: 14,
        onSelectionChanged: (e: DropDownButtonTypes.SelectionChangedEvent): void => {
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
        items: lineHeights,
        selectedItemKey: 1.35,
        onSelectionChanged: (e: DropDownButtonTypes.SelectionChangedEvent): void => {
          setLineHeight(e.item.lineHeight);
        },
      },
    },
  ], [onInitialized]);

  return (
    <div>
      <div className="dx-fieldset">
        <div className="dx-fieldset-header">Standalone button</div>
        <div className="dx-field">
          <div className="dx-field-label">
            Text and icon
          </div>
          <div className="dx-field-value">
            <DropDownButton
              text="Download Trial"
              icon="save"
              dropDownOptions={buttonDropDownOptions}
              items={downloads}
              onItemClick={onItemClick}
            />
          </div>
        </div>

        <div className="dx-field">
          <div className="dx-field-label">
            Custom template and actions
          </div>
          <div className="dx-field-value">
            <DropDownButton
              id="custom-template"
              splitButton={true}
              useSelectMode={false}
              items={profileSettings}
              displayExpr="name"
              keyExpr="id"
              onButtonClick={onButtonClick}
              onItemClick={onItemClick}
              render={DropDownButtonTemplate}
            >
            </DropDownButton>
          </div>
        </div>
      </div>

      <div className="dx-fieldset">
        <div className="dx-fieldset-header">Embedded in a Toolbar</div>
        <div className="dx-field">
          <Toolbar items={toolbarItems}>
            <Template name="colorpicker">
              <div className="custom-color-picker">
                {colors.map((colorValue: string | null, i: number) => (
                  <ColorIcon key={i} color={colorValue} onClick={onColorClick} />
                ))}
              </div>
            </Template>
            <Template name="fontItem" render={itemTemplateRender}>
            </Template>
          </Toolbar>
        </div>
        <div className="dx-field" style={{
          color: color ?? undefined,
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
