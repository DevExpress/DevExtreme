import React, { useCallback, useState } from 'react';

import Accordion from 'devextreme-react/accordion';
import Menu from 'devextreme-react/menu';
import SelectBox from 'devextreme-react/select-box';
import TreeView from 'devextreme-react/tree-view';

import { continents, europeCountries, languageLabel } from './data.ts';

interface Country {
  nameAr: string;
  nameEn: string;
  capitalAr: string;
  capitalEn: string;
  population: number;
  area: number;
}

interface AccordionItem {
  nameAr: string;
  nameEn: string;
}

const languages = [
  'Arabic: Right-to-Left direction',
  'English: Left-to-Right direction',
];

const renderArabicTitle = (item: AccordionItem) => (<div>{item.nameAr}</div>);

const renderArabic = (country: Country) => (
  <div>
    <div>عاصمة: {country.capitalAr} </div>
    <div>عدد السكان: {country.population} نسمة</div>
    <div>المساحة: {country.area} كم<sup>2</sup></div>
  </div>
);

const renderEnglishTitle = (item: AccordionItem) => (<div>{item.nameEn}</div>);

const renderEnglish = (country: Country) => (
  <div>
    <div>Capital: {country.capitalEn} </div>
    <div>Population: {country.population} people</div>
    <div>Area: {country.area} km<sup>2</sup></div>
  </div>
);

const App = () => {
  const [rtlEnabled, setRtl] = useState(false);

  const selectLanguage = useCallback(({ value }) => {
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
};

export default App;
