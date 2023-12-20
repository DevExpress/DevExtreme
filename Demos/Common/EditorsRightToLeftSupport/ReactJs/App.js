import React, { useCallback, useState } from 'react';
import { NumberBox } from 'devextreme-react/number-box';
import { SelectBox } from 'devextreme-react/select-box';
import { Switch } from 'devextreme-react/switch';
import { TextBox } from 'devextreme-react/text-box';
import { Autocomplete } from 'devextreme-react/autocomplete';
import { CheckBox } from 'devextreme-react/check-box';
import { TextArea } from 'devextreme-react/text-area';
import { TagBox } from 'devextreme-react/tag-box';
import {
  europeanUnion,
  numberBoxLabel,
  notesLabel,
  nameLabel,
  textBoxLabel,
  europeanUnionDataLabel,
  languageLabel,
  autocompleteLabel,
} from './data.js';

const languages = ['Arabic: Right-to-Left direction', 'English: Left-to-Right direction'];
const tagBoxDefaultValue = [europeanUnion[0].id];
function App() {
  const [rtlEnabled, setRtlEnabled] = useState(false);
  const [displayExpr, setDisplayExpr] = useState('nameEn');
  const [textValue, setTextValue] = useState('text');
  const onLanguageChanged = useCallback((args) => {
    const isRTL = args.value === languages[0];
    setDisplayExpr(isRTL ? 'nameAr' : 'nameEn');
    setRtlEnabled(isRTL);
    setTextValue(isRTL ? 'نص' : 'text');
  }, []);
  return (
    <div>
      <div className={rtlEnabled ? 'dx-rtl' : null}>
        <div className="options">
          <div className="caption">Options</div>
          <div className="dx-fieldset">
            <div className="dx-field">
              <div className="dx-field-label">Language</div>
              <div className="dx-field-value">
                <SelectBox
                  items={languages}
                  inputAttr={languageLabel}
                  defaultValue={languages[1]}
                  rtlEnabled={rtlEnabled}
                  onValueChanged={onLanguageChanged}
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
                inputAttr={textBoxLabel}
                defaultValue={textValue}
                rtlEnabled={rtlEnabled}
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Number Box</div>
            <div className="dx-field-value">
              <NumberBox
                showSpinButtons={true}
                defaultValue={123}
                rtlEnabled={rtlEnabled}
                inputAttr={numberBoxLabel}
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Select Box</div>
            <div className="dx-field-value">
              <SelectBox
                items={europeanUnion}
                inputAttr={europeanUnionDataLabel}
                defaultValue={europeanUnion[0]}
                rtlEnabled={rtlEnabled}
                displayExpr={displayExpr}
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Tag Box</div>
            <div className="dx-field-value">
              <TagBox
                items={europeanUnion}
                defaultValue={tagBoxDefaultValue}
                rtlEnabled={rtlEnabled}
                inputAttr={nameLabel}
                displayExpr={displayExpr}
                placeholder="..."
                valueExpr="id"
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Text Area</div>
            <div className="dx-field-value">
              <TextArea
                defaultValue={textValue}
                rtlEnabled={rtlEnabled}
                inputAttr={notesLabel}
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Autocomplete</div>
            <div className="dx-field-value">
              <Autocomplete
                items={europeanUnion}
                rtlEnabled={rtlEnabled}
                valueExpr={displayExpr}
                inputAttr={autocompleteLabel}
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Check Box</div>
            <div className="dx-field-value">
              <CheckBox
                defaultValue={true}
                text={textValue}
                rtlEnabled={rtlEnabled}
              />
            </div>
          </div>
          <div className="dx-field">
            <div className="dx-field-label">Switch</div>
            <div className="dx-field-value">
              <Switch rtlEnabled={rtlEnabled} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
