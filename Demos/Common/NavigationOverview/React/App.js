import React from 'react';

import TreeView from 'devextreme-react/tree-view';
import TabPanel from 'devextreme-react/tab-panel';
import { continents } from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabPanelIndex: 0,
      countryData: continents[0].items[0],
      citiesData: continents[0].items[0].cities,
    };

    this.handleTreeViewSelectionChange = this.handleTreeViewSelectionChange.bind(this);
    this.handleTabPanelSelectionChange = this.handleTabPanelSelectionChange.bind(this);
  }

  render() {
    const { countryData } = this.state;
    return (
      <div className="container">
        <div className="left-content">
          <TreeView
            dataSource={continents}
            selectionMode="single"
            selectByClick={true}
            onItemSelectionChanged={this.handleTreeViewSelectionChange}
          />
        </div>
        <div className="right-content">
          <div className="title-container">
            <img className="flag" src={countryData.flag} />
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
            selectedIndex={this.state.tabPanelIndex}
            onSelectionChanged={this.handleTabPanelSelectionChange}
            dataSource={this.state.citiesData}
            animationEnabled={true}
            id="tabpanel"
          />
        </div>
      </div>
    );
  }

  handleTreeViewSelectionChange(e) {
    const countryData = e.itemData;
    if (countryData.cities) {
      this.setState({
        tabPanelIndex: 0,
        countryData: e.itemData,
        citiesData: countryData.cities,
      });
    }
  }

  handleTabPanelSelectionChange(e) {
    this.setState({
      tabPanelIndex: e.value,
    });
  }
}

function renderPanelItemTitle(item) {
  return <span className="tab-panel-title">{item.text}</span>;
}

function renderPanelItem(city) {
  return (
    <React.Fragment>
      <img className="flag" src={city.flag} />
      <div className="right-content">
        <div>
          <b>{(city.capital) ? 'Capital. ' : ''}</b>{city.description}
        </div>
        <div className="stats">
          <div>
            <div>Population</div>
            <div><b>{city.population} people</b></div>
          </div>
          <div>
            <div>Area</div>
            <div><b>{city.area} km<sup>2</sup></b></div>
          </div>
          <div>
            <div>Density</div>
            <div><b>{city.density}/km<sup>2</sup></b></div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default App;
