import React from 'react';

import { markup } from './data.js';
import HtmlEditor, { Toolbar, MediaResizing, Item } from 'devextreme-react/html-editor';
import CheckBox from 'devextreme-react/check-box';

const sizeValues = ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt'];
const fontValues = ['Arial', 'Courier New', 'Georgia', 'Impact', 'Lucida Console', 'Tahoma', 'Times New Roman', 'Verdana'];
const headerValues = [false, 1, 2, 3, 4, 5];

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      isMultiline: true
    };

    this.multilineChanged = this.multilineChanged.bind(this);
  }
  render() {
    return (
      <div className="widget-container">
        <HtmlEditor
          height="725px"
          defaultValue={markup}
        >
          <MediaResizing enabled={true} />
          <Toolbar multiline={this.state.isMultiline}>
            <Item formatName="undo" />
            <Item formatName="redo" />
            <Item formatName="separator" />
            <Item
              formatName="size"
              formatValues={sizeValues}
            />
            <Item
              formatName="font"
              formatValues={fontValues}
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
            <Item formatName="orderedList" />
            <Item formatName="bulletList" />
            <Item formatName="separator" />
            <Item
              formatName="header"
              formatValues={headerValues}
            />
            <Item formatName="separator" />
            <Item formatName="color" />
            <Item formatName="background" />
            <Item formatName="separator" />
            <Item formatName="link" />
            <Item formatName="image" />
            <Item formatName="separator" />
            <Item formatName="clear" />
            <Item formatName="codeBlock" />
            <Item formatName="blockquote" />
            <Item formatName="separator" />
            <Item formatName="insertTable" />
            <Item formatName="insertRowAbove" />
            <Item formatName="insertRowBelow" />
            <Item formatName="insertColumnLeft" />
            <Item formatName="insertColumnRight" />
            <Item formatName="deleteRow" />
            <Item formatName="deleteColumn" />
            <Item formatName="deleteTable" />
          </Toolbar>
          {HTMLReactParser(markup)}
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
        </div>
      </div>
    );
  }
  multilineChanged(e) {
    this.setState({
      isMultiline: e.value
    });
  }
}

export default App;
