import React from 'react';

import HtmlEditor, { Toolbar, Item } from 'devextreme-react/html-editor';
import Popup from 'devextreme-react/popup';
import { markup } from './data.js';

const headerValues = [false, 1, 2, 3, 4, 5];
const headerOptions = { inputAttr: { 'aria-label': 'Header' } };

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      value: markup,
      popupVisible: false,
    };

    this.toolbarButtonOptions = {
      text: 'Show markup',
      stylingMode: 'text',
      onClick: this.customButtonClick.bind(this),
    };

    this.valueChanged = this.valueChanged.bind(this);
    this.popupHiding = this.popupHiding.bind(this);
  }

  render() {
    const { value, popupVisible } = this.state;

    return (
      <div className="widget-container">
        <HtmlEditor
          value={value}
          onValueChanged={this.valueChanged}
        >
          <Toolbar>
            <Item name="undo" />
            <Item name="redo" />
            <Item name="separator" />
            <Item
              name="header"
              acceptedValues={headerValues}
              options={headerOptions}
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
            <Item
              widget="dxButton"
              options={this.toolbarButtonOptions}
            />
          </Toolbar>
        </HtmlEditor>
        <Popup
          showTitle={true}
          title="Markup"
          visible={popupVisible}
          onHiding={this.popupHiding}
        >
          {value}
        </Popup>
      </div>
    );
  }

  valueChanged(e) {
    this.setState({
      value: e.value,
    });
  }

  popupHiding() {
    this.setState({
      popupVisible: false,
    });
  }

  customButtonClick() {
    this.setState({
      popupVisible: true,
    });
  }
}

export default App;
