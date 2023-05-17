import React from 'react';
import Accordion from 'devextreme-react/accordion';
import CheckBox from 'devextreme-react/check-box';
import TagBox from 'devextreme-react/tag-box';
import Slider, { Tooltip, Label } from 'devextreme-react/slider';

import service from './data.js';
import CustomTitle from './CustomTitle.js';
import CustomItem from './CustomItem.js';

const companyLabel = { 'aria-label': 'Company' };

class App extends React.Component {
  constructor(props) {
    super(props);
    this.companies = service.getCompanies();
    this.state = {
      selectedItems: [this.companies[0]],
      multiple: false,
      collapsible: false,
      animationDuration: 300,
    };
    this.selectionChanged = this.selectionChanged.bind(this);
    this.selectedItemsChanged = this.selectedItemsChanged.bind(this);
    this.multipleChanged = this.multipleChanged.bind(this);
    this.collapsibleChanged = this.collapsibleChanged.bind(this);
    this.animationDurationChanged = this.animationDurationChanged.bind(this);
  }

  render() {
    const {
      selectedItems, multiple, collapsible, animationDuration,
    } = this.state;
    return (
      <div id="accordion">
        <Accordion
          dataSource={this.companies}
          collapsible={collapsible}
          multiple={multiple}
          animationDuration={animationDuration}
          selectedItems={selectedItems}
          onSelectionChanged={this.selectionChanged}
          itemTitleRender={CustomTitle}
          itemRender={CustomItem}
          id="accordion-container"
        />
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <CheckBox text="Multiple enabled"
              value={multiple}
              onValueChanged={this.multipleChanged}
            />
          </div>
          <div className="option">
            <CheckBox
              text="Collapsible enabled"
              value={collapsible}
              onValueChanged={this.collapsibleChanged}
            />
          </div>
          <div className="option">
            <span>Animation duration</span>
            <Slider
              min={0}
              max={1000}
              value={animationDuration}
              onValueChanged={this.animationDurationChanged}
            >
              <Tooltip enabled={true} position="bottom" />
              <Label visible={true} />
            </Slider>
          </div>
          <div className="option">
            <span className="caption">Selected Items</span>
            <TagBox dataSource={this.companies}
              displayExpr="CompanyName"
              value={selectedItems}
              inputAttr={companyLabel}
              onValueChanged={this.selectedItemsChanged}
              disabled={!multiple}
            />
          </div>
        </div>
      </div>
    );
  }

  selectionChanged(e) {
    let newItems = [...this.state.selectedItems];
    e.removedItems.forEach((item) => {
      const index = newItems.indexOf(item);
      if (index >= 0) {
        newItems.splice(index, 1);
      }
    });
    if (e.addedItems.length) {
      newItems = [...newItems, ...e.addedItems];
    }
    this.setState({
      selectedItems: newItems,
    });
  }

  selectedItemsChanged(e) {
    this.setState({
      selectedItems: e.value,
    });
  }

  multipleChanged(e) {
    this.setState({
      multiple: e.value,
    });
  }

  collapsibleChanged(e) {
    this.setState({
      collapsible: e.value,
    });
  }

  animationDurationChanged(e) {
    this.setState({
      animationDuration: e.value,
    });
  }
}

export default App;
