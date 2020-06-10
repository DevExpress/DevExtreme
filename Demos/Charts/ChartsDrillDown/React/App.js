import React from 'react';

import { Chart, Series, Legend, ValueAxis } from 'devextreme-react/chart';
import { Button } from 'devextreme-react/button';
import service from './data.js';

const colors = ['#6babac', '#e55253'];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFirstLevel: true,
      data: service.filterData('')
    };

    this.customizePoint = this.customizePoint.bind(this);
    this.onPointClick = this.onPointClick.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  render() {
    return (
      <div>
        <Chart
          id="chart"
          title="The Most Populated Countries by Continents"
          customizePoint={this.customizePoint}
          onPointClick={this.onPointClick}
          className={this.state.isFirstLevel ? 'pointer-on-bars' : ''}
          dataSource={this.state.data}
        >
          <Series type="bar" />
          <ValueAxis showZero={false} />
          <Legend visible={false} />
        </Chart>
        <Button className="button-container"
          text="Back"
          icon="chevronleft"
          visible={!this.state.isFirstLevel}
          onClick={this.onButtonClick}
        />
      </div>
    );
  }

  customizePoint() {
    return {
      color: colors[Number(this.state.isFirstLevel)],
      hoverStyle: !this.state.isFirstLevel ? {
        hatching: 'none'
      } : {}
    };
  }

  onPointClick(e) {
    if (this.state.isFirstLevel) {
      this.setState({
        isFirstLevel: false,
        data: service.filterData(e.target.originalArgument)
      });
    }
  }

  onButtonClick() {
    if (!this.state.isFirstLevel) {
      this.setState({
        isFirstLevel: true,
        data: service.filterData('')
      });
    }
  }
}

export default App;
