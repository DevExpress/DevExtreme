import React from 'react';

import { markup } from './data.js';
import HtmlEditor, { Toolbar, Item } from 'devextreme-react/html-editor';
import Popup from 'devextreme-react/popup';

const headerValues = [false, 1, 2, 3, 4, 5];

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      value: markup,
      popupVisible: false
    };

    this.toolbarButtonOptions = {
      text: 'Show markup',
      stylingMode: 'text',
      onClick: this.customButtonClick.bind(this)
    };

    this.valueChanged = this.valueChanged.bind(this);
    this.popupHiding = this.popupHiding.bind(this);
  }
  render() {
    let { value, popupVisible } = this.state;

    return (
      <div className="widget-container">
        <HtmlEditor
          value={value}
          onValueChanged={this.valueChanged}
        >
          <Toolbar>
            <Item formatName="undo" />
            <Item formatName="redo" />
            <Item formatName="separator" />
            <Item
              formatName="header"
              formatValues={headerValues}
            />
            <Item formatName="separator" />
            <Item formatName="bold" />
            <Item formatName="italic" />
            <Item formatName="strike" />
            <Item formatName="underline" />
            <Item formatName="separator" />
            <Item formatName="alignLeft" />
            <Item formatName="alignCenter" />
            <Item formatName="alignRight" />
            <Item formatName="alignJustify" />
            <Item formatName="separator" />
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
      value: e.value
    });
  }
  popupHiding() {
    this.setState({
      popupVisible: false
    });
  }
  customButtonClick() {
    this.setState({
      popupVisible: true
    });
  }
}

export default App;
