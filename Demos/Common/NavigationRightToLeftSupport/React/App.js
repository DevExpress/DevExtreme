import React from 'react';
import SelectBox from 'devextreme-react/select-box';
import Menu from 'devextreme-react/menu';
import TreeView from 'devextreme-react/tree-view';
import Accordion from 'devextreme-react/accordion';
import { continents, europeCountries, languageLabel } from './data.js';

const languages = [
  'Arabic: Right-to-Left direction',
  'English: Left-to-Right direction',
];

function App() {
  const [rtlEnabled, setRtl] = React.useState(false);

  const selectLanguage = React.useCallback(({ value }) => {
    setRtl(value === languages[0]);
  }, []);

  return (
    <div className={rtlEnabled ? 'dx-rtl' : ''}>
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
                onValueChanged={selectLanguage}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="dx-fieldset">
          <div className="dx-fieldset-header">
            <Menu
              dataSource={continents}
              rtlEnabled={rtlEnabled}
              displayExpr={rtlEnabled ? 'textAr' : 'text'}
            />
          </div>
        </div>
        <div className="dx-fieldset">
          <div className="dx-field">
            <div className="dx-field-label">
              <TreeView
                width={200}
                dataSource={continents}
                displayExpr={rtlEnabled ? 'textAr' : 'text'}
                rtlEnabled={rtlEnabled}
              />
            </div>
            <div className="dx-field-value">
              <Accordion
                dataSource={europeCountries}
                rtlEnabled={rtlEnabled}
                itemTitleRender={rtlEnabled ? renderArabicTitle : renderEnglishTitle}
                itemRender={rtlEnabled ? renderArabic : renderEnglish}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderArabicTitle(item) {
  return (<div>{item.nameAr}</div>);
}

function renderArabic(country) {
  return (
    <div>
      <div>عاصمة: { country.capitalAr } </div>
      <div>عدد السكان: { country.population } نسمة</div>
      <div>المساحة: { country.area } كم<sup>2</sup></div>
    </div>
  );
}

function renderEnglishTitle(item) {
  return (<div>{item.nameEn}</div>);
}

function renderEnglish(country) {
  return (
    <div>
      <div>Capital: { country.capitalEn } </div>
      <div>Population: { country.population } people</div>
      <div>Area: { country.area } km<sup>2</sup></div>
    </div>
  );
}

export default App;
