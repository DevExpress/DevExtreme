import React from 'react';
import Menu from 'devextreme-react/menu';
import SelectBox from 'devextreme-react/select-box';
import CheckBox from 'devextreme-react/check-box';
import service from './data.js';

const orientations = ['horizontal', 'vertical'];
const orientationLabel = { 'aria-label': 'Orientation' };
const showSubmenuModeLabel = { 'aria-label': 'Show Submenu Mode' };

class App extends React.Component {
  constructor(props) {
    super(props);
    this.products = service.getProducts();
    this.showSubmenuModes = [{
      name: 'onHover',
      delay: { show: 0, hide: 500 },
    }, {
      name: 'onClick',
      delay: { show: 0, hide: 300 },
    }];
    this.state = {
      showFirstSubmenuModes: this.showSubmenuModes[1],
      orientation: 'horizontal',
      hideSubmenuOnMouseLeave: false,
      currentProduct: null,
    };
    this.itemClick = this.itemClick.bind(this);
    this.showSubmenuModeChanged = this.showSubmenuModeChanged.bind(this);
    this.orientationChanged = this.orientationChanged.bind(this);
    this.hideSubmenuOnMouseLeaveChanged = this.hideSubmenuOnMouseLeaveChanged.bind(this);
  }

  render() {
    const {
      showFirstSubmenuModes, orientation, hideSubmenuOnMouseLeave, currentProduct,
    } = this.state;
    return (
      <div className="form">
        <div>
          <div className="label">Catalog:</div>
          <Menu dataSource={this.products}
            displayExpr="name"
            showFirstSubmenuMode={showFirstSubmenuModes}
            orientation={orientation}
            hideSubmenuOnMouseLeave={hideSubmenuOnMouseLeave}
            onItemClick={this.itemClick}
          />
          {currentProduct
          && <div id="product-details">
            <img src={currentProduct.icon} />
            <div className="name">{currentProduct.name}</div>
            <div className="price">{`$${currentProduct.price}`}</div>
          </div>
          }
        </div>
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <div>Show First Submenu Mode</div>
            <SelectBox
              items={this.showSubmenuModes}
              displayExpr="name"
              inputAttr={showSubmenuModeLabel}
              value={showFirstSubmenuModes}
              onValueChanged={this.showSubmenuModeChanged}
            />
          </div>
          <div className="option">
            <div>Orientation</div>
            <SelectBox
              items={orientations}
              inputAttr={orientationLabel}
              value={orientation}
              onValueChanged={this.orientationChanged}
            />
          </div>
          <div className="option">
            <CheckBox
              text="Hide Submenu on Mouse Leave"
              value={hideSubmenuOnMouseLeave}
              onValueChanged={this.hideSubmenuOnMouseLeaveChanged}
            />
          </div>
        </div>
      </div>
    );
  }

  itemClick(e) {
    if (e.itemData.price) {
      this.setState({
        currentProduct: e.itemData,
      });
    }
  }

  showSubmenuModeChanged(e) {
    this.setState({
      showFirstSubmenuModes: e.value,
    });
  }

  orientationChanged(e) {
    this.setState({
      orientation: e.value,
    });
  }

  hideSubmenuOnMouseLeaveChanged(e) {
    this.setState({
      hideSubmenuOnMouseLeave: e.value,
    });
  }
}

export default App;
