import React from 'react';

import CheckBox from 'devextreme-react/check-box';
import TabPanel from 'devextreme-react/tab-panel';

import { multiViewItems as companies } from './data.js';
import CompanyItem from './CompanyItem.js';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      animationEnabled: true,
      swipeEnabled: true,
      loop: false,
      selectedIndex: 0
    };
    this.onSelectionChanged = this.onSelectionChanged.bind(this);
    this.onLoopChanged = this.onLoopChanged.bind(this);
    this.onAnimationEnabledChanged = this.onAnimationEnabledChanged.bind(this);
    this.onSwipeEnabledChanged = this.onSwipeEnabledChanged.bind(this);
  }

  render() {
    const { animationEnabled, loop, selectedIndex, swipeEnabled } = this.state;
    return (
      <div>
        <TabPanel
          height={260}
          dataSource={companies}
          selectedIndex={selectedIndex}
          onOptionChanged={this.onSelectionChanged}
          loop={loop}
          itemTitleRender={this.itemTitleRender}
          itemComponent={CompanyItem}
          animationEnabled={animationEnabled}
          swipeEnabled={swipeEnabled}
        />
        <div className="item-box">
            Item <span>{ selectedIndex + 1 }</span> of <span>{ companies.length }</span>
        </div>
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <CheckBox
              value={loop}
              onValueChanged={this.onLoopChanged}
              text="Loop enabled"
            />
          </div>
          <div className="option">
            <CheckBox
              value={ animationEnabled }
              onValueChanged={this.onAnimationEnabledChanged}
              text="Animation enabled"
            />
          </div>
          <div className="option">
            <CheckBox
              value={ swipeEnabled }
              onValueChanged={this.onSwipeEnabledChanged}
              text="Swipe enabled"
            />
          </div>
        </div>
      </div>
    );
  }

  itemTitleRender(company) {
    return <span>{company.CompanyName}</span>;
  }

  onSelectionChanged(args) {
    if(args.name == 'selectedIndex') {
      this.setState({
        selectedIndex: args.value
      });
    }
  }

  onLoopChanged(args) {
    this.setState({
      loop: args.value
    });
  }

  onAnimationEnabledChanged(args) {
    this.setState({
      animationEnabled: args.value
    });
  }

  onSwipeEnabledChanged(args) {
    this.setState({
      swipeEnabled: args.value
    });
  }
}

export default App;
