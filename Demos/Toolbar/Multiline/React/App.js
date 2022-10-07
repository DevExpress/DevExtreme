import React from 'react';
import Toolbar, { Item } from 'devextreme-react/toolbar';
import { Button } from 'devextreme-react/button';
import { ButtonGroup } from 'devextreme-react/button-group';
import RadioGroup from 'devextreme-react/radio-group';
import Resizable from 'devextreme-react/resizable';
import CheckBox from 'devextreme-react/check-box';
import DateBox from 'devextreme-react/date-box';
import DropDownButton from 'devextreme-react/drop-down-button';
import SelectBox from 'devextreme-react/select-box';
import notify from 'devextreme/ui/notify';
import 'devextreme/ui/select_box';
import {
  fontSizes,
  lineHeights,
  fontFamilies,
  fontStyles,
  textAlignItems,
  textAlignItemsExtended,
  listTypes,
} from './data.js';

const lineHeightDefault = lineHeights[1].lineHeight;
const textAlignDefault = [textAlignItems[0].alignment];
const fontSizeDefault = fontSizes[2].size;
const dateBoxValue = new Date(2022, 9, 7);

const toolbarLineModes = [
  {
    text: 'Multiline mode',
    value: true,
  },
  {
    text: 'Single-line mode',
    value: false,
  },
];

function onButtonClick(name) {
  notify(`The "${name}" button was clicked`);
}

function onSelectionChanged(name) {
  notify(`The "${name}" value was changed`);
}

const attachButtonOptions = {
  icon: 'attach',
  text: 'Attach',
  onClick: () => {
    onButtonClick('Attach');
  },
};

const addButtonOptions = {
  icon: 'add',
  text: 'Add',
  onClick: () => {
    onButtonClick('Add');
  },
};

const removeButtonOptions = {
  icon: 'trash',
  text: 'Remove',
  onClick: () => {
    onButtonClick('Remove');
  },
};

const aboutButtonOptions = {
  icon: 'help',
  text: 'About',
  onClick: () => {
    onButtonClick('About');
  },
};

function App() {
  const [lineHeight, setLineHeight] = React.useState(lineHeightDefault);
  const [textAlign, setTextAlign] = React.useState(textAlignDefault);
  const [fontSize, setFontSize] = React.useState(fontSizeDefault);
  const [multiline, setMultiline] = React.useState(true);
  const [checkBoxValue, setCheckBoxValue] = React.useState(false);

  const onDateBoxValueChanged = React.useCallback(() => {
    notify('The "DateBox" value was changed');
  }, []);

  const onFontFamilyClick = React.useCallback(() => {
    notify('The "Font Family" value was changed');
  }, []);

  const onUndoButtonClick = React.useCallback(() => {
    onButtonClick('Undo');
  }, []);

  const onButtonGroupClick = React.useCallback((e) => {
    onButtonClick(e.itemData.hint);
  }, []);

  const onRedoButtonClick = React.useCallback(() => {
    onButtonClick('Redo');
  }, []);

  const onCheckBoxValueChanged = React.useCallback(({ value }) => {
    setCheckBoxValue(value);
    notify('The "Navigation Pane" checkbox value was changed');
  }, [setCheckBoxValue]);

  const onLineHeightChanged = React.useCallback((e) => {
    setLineHeight(e.item.lineHeight);
    onSelectionChanged('Line Height');
  }, [setLineHeight]);

  const onFontSizeChange = React.useCallback((e) => {
    setFontSize(e.item.size);
    onSelectionChanged('Font Size');
  }, [setFontSize]);

  const onTextAlignChanged = React.useCallback((e) => {
    const { alignment, hint } = e.itemData;

    setTextAlign([alignment]);
    onButtonClick(hint);
  }, [setTextAlign]);

  const onToolbarLineModeChanged = React.useCallback(({ value }) => {
    setMultiline(value);
  }, [setMultiline]);

  const renderFontSize = React.useCallback((itemData) => (
    <div style={{ fontSize: `${itemData.size}px` }}>{itemData.text}</div>
  ), []);

  const renderTextAlign = React.useCallback(() => (
    <ButtonGroup
      keyExpr="alignment"
      stylingMode="outlined"
      items={textAlignItems}
      selectedItemKeys={textAlign}
      onItemClick={onTextAlignChanged}
    ></ButtonGroup>
  ), [textAlign, textAlignItems, onTextAlignChanged]);

  const renderTextAlignMenu = React.useCallback(() => (
    <ButtonGroup
      displayExpr="text"
      keyExpr="alignment"
      stylingMode="outlined"
      items={textAlignItemsExtended}
      selectedItemKeys={textAlign}
      onItemClick={onTextAlignChanged}
    ></ButtonGroup>
  ), [textAlign, textAlignItemsExtended, onTextAlignChanged]);

  const renderMenuSeparator = React.useCallback(() => <div className="toolbar-menu-separator"></div>, []);

  return (
    <React.Fragment>
      <div className='widget-container'>
        <Resizable
          className="resizable-container"
          minWidth={500}
          minHeight={150}
          maxHeight={370}
          handles="right"
          area=".widget-container"
        >
          <Toolbar multiline={multiline}>
            <Item location="before">
              <Button
                icon="undo"
                onClick={onUndoButtonClick}
              ></Button>
            </Item>

            <Item location="before">
              <Button
                icon="redo"
                onClick={onRedoButtonClick}
              ></Button>
            </Item>

            <Item
              cssClass="toolbar-separator-container"
              location="before"
              locateInMenu="auto"
              menuItemRender={renderMenuSeparator}
            >
              <div className="toolbar-separator"></div>
            </Item>

            <Item location="before" locateInMenu="auto">
              <DropDownButton
                width="100%"
                displayExpr="text"
                keyExpr="size"
                useSelectMode={true}
                items={fontSizes}
                selectedItemKey={fontSize}
                itemRender={renderFontSize}
                onSelectionChanged={onFontSizeChange}
              ></DropDownButton>
            </Item>

            <Item location="before" locateInMenu="auto">
              <DropDownButton
                width="100%"
                icon="indent"
                displayExpr="text"
                keyExpr="lineHeight"
                useSelectMode={true}
                items={lineHeights}
                selectedItemKey={lineHeight}
                onSelectionChanged={onLineHeightChanged}
              ></DropDownButton>
            </Item>

            <Item location="before" locateInMenu="auto">
              <SelectBox
                placeholder="Font"
                displayExpr="text"
                dataSource={fontFamilies}
                onItemClick={onFontFamilyClick}
              ></SelectBox>
            </Item>

            <Item
              cssClass="toolbar-separator-container"
              location="before"
              locateInMenu="auto"
              menuItemRender={renderMenuSeparator}
            >
              <div className="toolbar-separator"></div>
            </Item>

            <Item location="before">
              <ButtonGroup
                keyExpr="icon"
                stylingMode="outlined"
                selectionMode="multiple"
                items={fontStyles}
                onItemClick={onButtonGroupClick}
              ></ButtonGroup>
            </Item>

            <Item location="before">
              <div className="toolbar-separator"></div>
            </Item>

            <Item
              cssClass="dx-toolbar-hidden-button-group"
              location="before"
              locateInMenu="auto"
              render={renderTextAlign}
              menuItemRender={renderTextAlignMenu}
            ></Item>

            <Item location="before">
              <ButtonGroup
                keyExpr="alignment"
                stylingMode="outlined"
                items={listTypes}
                onItemClick={onButtonGroupClick}
              ></ButtonGroup>
            </Item>

            <Item
              cssClass="toolbar-separator-container"
              location="before"
              locateInMenu="auto"
              menuItemRender={renderMenuSeparator}
            >
              <div className="toolbar-separator"></div>
            </Item>

            <Item location="before" locateInMenu="auto">
              <DateBox
                width={200}
                type="date"
                value={dateBoxValue}
                onValueChanged={onDateBoxValueChanged}
              ></DateBox>
            </Item>

            <Item
              cssClass="toolbar-separator-container"
              location="before"
              locateInMenu="auto"
              menuItemRender={renderMenuSeparator}
            >
              <div className="toolbar-separator"></div>
            </Item>

            <Item location="before" locateInMenu="auto">
              <CheckBox
                value={checkBoxValue}
                text="Navigation Pane"
                onValueChanged={onCheckBoxValueChanged}
              ></CheckBox>
            </Item>

            <Item
              location="after"
              showText="inMenu"
              widget="dxButton"
              options={attachButtonOptions}
            ></Item>

            <Item
              location="after"
              locateInMenu="auto"
              showText="inMenu"
              widget="dxButton"
              options={addButtonOptions}
            ></Item>

            <Item
              location="after"
              locateInMenu="auto"
              showText="inMenu"
              widget="dxButton"
              options={removeButtonOptions}
            ></Item>

            <Item
              locateInMenu="always"
              showText="inMenu"
              widget="dxButton"
              options={aboutButtonOptions}
            ></Item>
          </Toolbar>
        </Resizable>
      </div>

      <div className="options-container">
        <div className="caption">Options</div>

        <RadioGroup
          items={toolbarLineModes}
          value={multiline}
          layout="horizontal"
          valueExpr="value"
          onValueChanged={onToolbarLineModeChanged}
        ></RadioGroup>
      </div>
    </React.Fragment>
  );
}

export default App;
