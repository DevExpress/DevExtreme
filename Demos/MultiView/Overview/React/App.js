import React from 'react';

import CheckBox from 'devextreme-react/check-box';
import MultiView from 'devextreme-react/multi-view';

import { multiViewItems as companies } from './data.js';
import CompanyItem from './CompanyItem.js';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      animationEnabled: true,
      loop: false,
      selectedIndex: 0
    };
    this.onSelectionChanged = this.onSelectionChanged.bind(this);
    this.onLoopChanged = this.onLoopChanged.bind(this);
    this.onAnimationEnabledChanged = this.onAnimationEnabledChanged.bind(this);
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
  render() {
    return (
      <div id="multiview">
        <div>
            Item <span>{ this.state.selectedIndex + 1 }</span> of <span>{ companies.length }</span>: <i>Swipe the view horizontally to switch to the next view.</i>
        </div>
        <MultiView
          height={300}
          dataSource={companies}
          selectedIndex={this.state.selectedIndex}
          onOptionChanged={this.onSelectionChanged}
          loop={this.state.loop}
          itemComponent={CompanyItem}
          animationEnabled={this.state.animationEnabled} />
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <CheckBox
              value={ this.state.loop }
              onValueChanged={this.onLoopChanged}
              text="Loop enabled"
            />
          </div>
          <div className="option">
            <CheckBox
              value={ this.state.animationEnabled }
              onValueChanged={this.onAnimationEnabledChanged}
              text="Animation enabled"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
