import React from 'react';

import { markup } from './data.js';
import HtmlEditor, { Toolbar, Item } from 'devextreme-react/html-editor';
import ButtonGroup, { Item as ButtonItem } from 'devextreme-react/button-group';

import 'devextreme/ui/html_editor/converters/markdown';

const sizeValues = ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt'];
const fontValues = ['Arial', 'Courier New', 'Georgia', 'Impact', 'Lucida Console', 'Tahoma', 'Times New Roman', 'Verdana'];

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      valueContent: markup,
      editorValueType: 'html'
    };

    this.valueChanged = this.valueChanged.bind(this);
    this.valueTypeChanged = this.valueTypeChanged.bind(this);
  }
  render() {
    let { valueContent, editorValueType } = this.state;

    return (
      <div className="widget-container">
        <HtmlEditor
          height={300}
          value={valueContent}
          valueType={editorValueType}
          onValueChanged={this.valueChanged}
        >
          <Toolbar>
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
            <Item formatName="color" />
            <Item formatName="background" />
          </Toolbar>
        </HtmlEditor>

        <div className="options">
          <ButtonGroup
            onSelectionChanged={this.valueTypeChanged}
            defaultSelectedItemKeys={['Html']}
          >
            <ButtonItem text="Html" />
            <ButtonItem text="Markdown" />
          </ButtonGroup>
          <div className="value-content">
            {valueContent}
          </div>
        </div>
      </div>
    );
  }
  valueChanged(e) {
    this.setState({
      valueContent: e.value
    });
  }
  valueTypeChanged(e) {
    this.setState({
      editorValueType: e.addedItems[0].text.toLowerCase()
    });
  }
}

export default App;
