import React from 'react';
import DataGrid, { Column, Paging, SearchPanel } from 'devextreme-react/data-grid';
import SelectBox from 'devextreme-react/select-box';

import service from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.dataSource = service.getEuropeanUnion();
    this.languages = ['Arabic (Right-to-Left direction)', 'English (Left-to-Right direction)'];
    this.state = {
      placeholder: 'Search...',
      rtlEnabled: false,
      selectedValue: this.languages[1]
    };
    this.selectLanguage = this.selectLanguage.bind(this);
    this.headerCellRender = this.headerCellRender.bind(this);
  }
  selectLanguage(e) {
    let newRtlEnabled = e.value === this.languages[0];
    this.setState({
      rtlEnabled: newRtlEnabled,
      placeholder: newRtlEnabled ? 'بحث' : 'Search...',
      selectedValue: e.value
    });
  }
  headerCellRender() {
    return (
      <div>
        {this.state.rtlEnabled ? (
          <div>المساحة (كم<sup>2</sup>)</div>
        ) : (
          <div>Area (km<sup>2</sup>)</div>
        )}
      </div>
    );
  }
  render() {
    const { rtlEnabled, placeholder, selectedValue } = this.state;
    return (
      <React.Fragment>
        <DataGrid id="gridContainer"
          dataSource={this.dataSource}
          keyExpr="nameEn"
          rtlEnabled={rtlEnabled}
          showBorders={true}>
          <Paging defaultPageSize={15} />
          <SearchPanel visible={true} placeholder={placeholder} />
          <Column dataField={rtlEnabled ? 'nameAr' : 'nameEn'}
            caption={rtlEnabled ? 'الدولة' : 'Name'} />
          <Column dataField={rtlEnabled ? 'capitalAr' : 'capitalEn'}
            caption={rtlEnabled ? 'عاصمة' : 'Capital'} />
          <Column dataField="population"
            caption={rtlEnabled ? 'عدد السكان (نسمة) 2013' : 'Population'}
            format={{ type: 'fixedPoint', precision: 0 }} />
          <Column dataField="area"
            headerCellRender={this.headerCellRender}
            format={{ type: 'fixedPoint', precision: 0 }} />
          <Column dataField="accession" visible={false} />
        </DataGrid>
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <span>Language: </span>
            <SelectBox id="select-language"
              items={this.languages}
              value={selectedValue}
              width={250}
              onValueChanged={this.selectLanguage} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
