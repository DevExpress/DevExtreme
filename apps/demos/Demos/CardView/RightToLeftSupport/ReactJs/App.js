import React, { useState, useEffect } from "react";
import "devextreme/dist/css/dx.fluent.blue.light.css";
import "./style.css";
import { CardView } from "devextreme-react/card-view";
import { SelectBox } from "devextreme-react/select-box";
import { getEuropeanUnion, getLanguages, getColumns, getDefaultLanguage } from "./data";

const App = () => {
  const [unions, setUnions] = useState(getEuropeanUnion());
  const [languages, setLanguages] = useState(getLanguages());
  const [selectedLanguage, setSelectedLanguage] = useState(getDefaultLanguage());
  const [rtlEnabled, setRtlEnabled] = useState(selectedLanguage === languages[0]);
  const [columns, setColumns] = useState(getColumns(rtlEnabled));

  useEffect(() => {
    setRtlEnabled(selectedLanguage === languages[0]);
    setColumns(getColumns(selectedLanguage === languages[0]));
  }, [selectedLanguage]);

  return (
    <div className="demo-container">
      <CardView id="cardViewContainer" dataSource={unions} columns={columns} cardsPerRow={3} rtlEnabled={rtlEnabled} />

      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <span>Language:</span>
          <SelectBox
            items={languages}
            value={selectedLanguage}
            width={250}
            inputAttr={{ "aria-label": "Language" }}
            onValueChanged={(e) => setSelectedLanguage(e.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
