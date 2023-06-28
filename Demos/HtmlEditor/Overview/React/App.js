import React from 'react';

import HtmlEditor, {
  Toolbar, MediaResizing, ImageUpload, Item,
} from 'devextreme-react/html-editor';
import CheckBox from 'devextreme-react/check-box';
import SelectBox from 'devextreme-react/select-box';

import { markup, tabs, tabLabel } from './data.js';

const sizeValues = ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt'];
const fontValues = ['Arial', 'Courier New', 'Georgia', 'Impact', 'Lucida Console', 'Tahoma', 'Times New Roman', 'Verdana'];
const headerValues = [false, 1, 2, 3, 4, 5];
const fontSizeOptions = {
  inputAttr: {
    'aria-label': 'Font size',
  },
};
const fontFamilyOptions = {
  inputAttr: {
    'aria-label': 'Font family',
  },
};
const headerOptions = {
  inputAttr: {
    'aria-label': 'Font family',
  },
};

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      isMultiline: true,
      currentTab: tabs[2].value,
    };

    this.tabs = tabs;
    this.multilineChanged = this.multilineChanged.bind(this);
    this.currentTabChanged = this.currentTabChanged.bind(this);
  }

  render() {
    return (
      <div className="widget-container">
        <HtmlEditor
          height="725px"
          defaultValue={markup}
        >
          <MediaResizing enabled={true} />
          <ImageUpload tabs={this.state.currentTab} fileUploadMode="base64" />
          <Toolbar multiline={this.state.isMultiline}>
            <Item name="undo" />
            <Item name="redo" />
            <Item name="separator" />
            <Item
              name="size"
              acceptedValues={sizeValues}
              options={fontSizeOptions}
            />
            <Item
              name="font"
              acceptedValues={fontValues}
              options={fontFamilyOptions}
            />
            <Item name="separator" />
            <Item name="bold" />
            <Item name="italic" />
            <Item name="strike" />
            <Item name="underline" />
            <Item name="separator" />
            <Item name="alignLeft" />
            <Item name="alignCenter" />
            <Item name="alignRight" />
            <Item name="alignJustify" />
            <Item name="separator" />
            <Item name="orderedList" />
            <Item name="bulletList" />
            <Item name="separator" />
            <Item
              name="header"
              acceptedValues={headerValues}
              options={headerOptions}
            />
            <Item name="separator" />
            <Item name="color" />
            <Item name="background" />
            <Item name="separator" />
            <Item name="link" />
            <Item name="image" />
            <Item name="separator" />
            <Item name="clear" />
            <Item name="codeBlock" />
            <Item name="blockquote" />
            <Item name="separator" />
            <Item name="insertTable" />
            <Item name="deleteTable" />
            <Item name="insertRowAbove" />
            <Item name="insertRowBelow" />
            <Item name="deleteRow" />
            <Item name="insertColumnLeft" />
            <Item name="insertColumnRight" />
            <Item name="deleteColumn" />
          </Toolbar>
        </HtmlEditor>
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <CheckBox
              text="Multiline toolbar"
              value={this.state.isMultiline}
              onValueChanged={this.multilineChanged}
            />
          </div>
          <div className="option">
            <div className="label">Image upload tabs:</div>
            <SelectBox
              items={this.tabs}
              value={this.state.currentTab}
              valueExpr="value"
              inputAttr={tabLabel}
              displayExpr="name"
              onValueChanged={this.currentTabChanged}
            />
          </div>
        </div>
      </div>
    );
  }

  multilineChanged(e) {
    this.setState({
      isMultiline: e.value,
    });
  }

  currentTabChanged(e) {
    this.setState({
      currentTab: e.value,
    });
  }
}

export default App;
