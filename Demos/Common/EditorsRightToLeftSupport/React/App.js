import React from 'react';
import { NumberBox } from 'devextreme-react/number-box';
import { SelectBox } from 'devextreme-react/select-box';
import { Switch } from 'devextreme-react/switch';
import { TextBox } from 'devextreme-react/text-box';
import { Autocomplete } from 'devextreme-react/autocomplete';
import { CheckBox } from 'devextreme-react/check-box';
import { TextArea } from 'devextreme-react/text-area';
import { TagBox } from 'devextreme-react/tag-box';
import { europeanUnion } from './data.js';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      rtlEnabled: false
    };
    this.languages = [
      'Arabic: Right-to-Left direction',
      'English: Left-to-Right direction'
    ];
    this.displayExpr = 'nameEn';
    this.textValue = 'text';
    this.onLanguageChanged = this.onLanguageChanged.bind(this);
  }

  onLanguageChanged(args) {
    const isRTL = args.value === this.languages[0];

    this.displayExpr = isRTL ? 'nameAr' : 'nameEn';
    this.setState({ rtlEnabled: isRTL });
    this.textValue = isRTL ? 'نص' : 'text';
  }

  render() {
    return (
      <div>
        <div className={this.state.rtlEnabled ? 'dx-rtl' : null}>
          <div className="options">
            <div className="caption">Options</div>
            <div className="dx-fieldset">
              <div className="dx-field">
                <div className="dx-field-label">Language</div>
                <div className="dx-field-value">
                  <SelectBox
                    items={this.languages}
                    defaultValue={this.languages[1]}
                    rtlEnabled={this.state.rtlEnabled}
                    onValueChanged={this.onLanguageChanged}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="dx-fieldset">
            <div className="dx-field">
              <div className="dx-field-label">Text Box</div>
              <div className="dx-field-value">
                <TextBox
                  showClearButton={true}
                  defaultValue={this.textValue}
                  rtlEnabled={this.state.rtlEnabled}
                />
              </div>
            </div>
            <div className="dx-field">
              <div className="dx-field-label">Number Box</div>
              <div className="dx-field-value">
                <NumberBox
                  showSpinButtons={true}
                  defaultValue="123"
                  rtlEnabled={this.state.rtlEnabled}
                />
              </div>
            </div>
            <div className="dx-field">
              <div className="dx-field-label">Select Box</div>
              <div className="dx-field-value">
                <SelectBox
                  items={europeanUnion}
                  defaultValue={europeanUnion[0]}
                  rtlEnabled={this.state.rtlEnabled}
                  displayExpr={this.displayExpr}
                />
              </div>
            </div>
            <div className="dx-field">
              <div className="dx-field-label">Tag Box</div>
              <div className="dx-field-value">
                <TagBox
                  items={europeanUnion}
                  defaultValue={[europeanUnion[0].id]}
                  rtlEnabled={this.state.rtlEnabled}
                  displayExpr={this.displayExpr}
                  placeholder="..."
                  valueExpr="id"
                />
              </div>
            </div>
            <div className="dx-field">
              <div className="dx-field-label">Text Area</div>
              <div className="dx-field-value">
                <TextArea
                  defaultValue={this.textValue}
                  rtlEnabled={this.state.rtlEnabled}
                />
              </div>
            </div>
            <div className="dx-field">
              <div className="dx-field-label">Autocomplete</div>
              <div className="dx-field-value">
                <Autocomplete
                  items={europeanUnion}
                  rtlEnabled={this.state.rtlEnabled}
                  valueExpr={this.displayExpr}
                />
              </div>
            </div>
            <div className="dx-field">
              <div className="dx-field-label">Check Box</div>
              <div className="dx-field-value">
                <CheckBox
                  defaultValue={true}
                  text={this.textValue}
                  rtlEnabled={this.state.rtlEnabled}
                />
              </div>
            </div>
            <div className="dx-field">
              <div className="dx-field-label">Switch</div>
              <div className="dx-field-value">
                <Switch
                  rtlEnabled={this.state.rtlEnabled}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
