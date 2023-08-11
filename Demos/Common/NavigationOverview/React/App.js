import React from 'react';
import TreeView from 'devextreme-react/tree-view';
import TabPanel from 'devextreme-react/tab-panel';
import { continents } from './data.js';

const renderPanelItemTitle = (item) => <span className="tab-panel-title">{item.text}</span>;

const renderPanelItem = (city) => (
  <React.Fragment>
    <img alt="country flag" className="flag" src={city.flag} />
    <div className="right-content">
      <div>
        <b>{city.capital ? 'Capital. ' : ''}</b>
        {city.description}
      </div>
      <div className="stats">
        <div>
          <div>Population</div>
          <div>
            <b>{city.population} people</b>
          </div>
        </div>
        <div>
          <div>Area</div>
          <div>
            <b>
              {city.area} km<sup>2</sup>
            </b>
          </div>
        </div>
        <div>
          <div>Density</div>
          <div>
            <b>
              {city.density}/km<sup>2</sup>
            </b>
          </div>
        </div>
      </div>
    </div>
  </React.Fragment>
);
function App() {
  const [tabPanelIndex, setTabPanelIndex] = React.useState(0);
  const [countryData, setCountryData] = React.useState(continents[0].items[0]);
  const [citiesData, setCitiesData] = React.useState(continents[0].items[0].cities);

  const handleTreeViewSelectionChange = React.useCallback((e) => {
    const selectedCountryData = e.itemData;
    if (selectedCountryData.cities) {
      setTabPanelIndex(0);
      setCountryData(selectedCountryData);
      setCitiesData(selectedCountryData.cities);
    }
  }, [setTabPanelIndex, setCountryData, setCitiesData]);

  const handleTabPanelSelectionChange = React.useCallback((e) => {
    setTabPanelIndex(e.value);
  }, [setTabPanelIndex]);

  return (
    <div className="container">
      <div className="left-content">
        <TreeView
          dataSource={continents}
          selectionMode="single"
          selectByClick={true}
          onItemSelectionChanged={handleTreeViewSelectionChange}
        />
      </div>
      <div className="right-content">
        <div className="title-container">
          <img alt="country flag" className="flag" src={countryData.flag} />
          <div>
            <div className="country-name">{countryData.fullName}</div>
            <div>{countryData.description}</div>
          </div>
        </div>

        <div className="stats">
          <div>
            <div className="sub-title">Area, km<sup>2</sup></div>
            <div className="stat-value">{countryData.area}</div>
          </div>
          <div>
            <div className="sub-title">Population</div>
            <div className="stat-value">{countryData.population}</div>
          </div>
          <div>
            <div className="sub-title">GDP, billion</div>
            <div className="stat-value">{`$${countryData.gdp}`}</div>
          </div>
        </div>

        <div className="sub-title">Largest cities</div>

        <TabPanel
          itemTitleRender={renderPanelItemTitle}
          itemRender={renderPanelItem}
          selectedIndex={tabPanelIndex}
          onSelectionChanged={handleTabPanelSelectionChange}
          dataSource={citiesData}
          animationEnabled={true}
          id="tabpanel"
        />
      </div>
    </div>
  );
}

export default App;
