import React from 'react';
import Menu from 'devextreme-react/menu';
import SelectBox from 'devextreme-react/select-box';
import CheckBox from 'devextreme-react/check-box';
import service from './data.js';

const orientations = ['horizontal', 'vertical'];
const orientationLabel = { 'aria-label': 'Orientation' };
const showSubmenuModeLabel = { 'aria-label': 'Show Submenu Mode' };
const products = service.getProducts();
const showSubmenuModes = [
  {
    name: 'onHover',
    delay: { show: 0, hide: 500 },
  },
  {
    name: 'onClick',
    delay: { show: 0, hide: 300 },
  },
];
const App = () => {
  const [showFirstSubmenuModes, setShowFirstSubmenuModes] = React.useState(showSubmenuModes[1]);
  const [orientation, setOrientation] = React.useState('horizontal');
  const [hideSubmenuOnMouseLeave, setHideSubmenuOnMouseLeave] = React.useState(false);
  const [currentProduct, setCurrentProduct] = React.useState(null);
  const itemClick = React.useCallback(
    (e) => {
      if (e.itemData.price) {
        setCurrentProduct(e.itemData);
      }
    },
    [setCurrentProduct],
  );
  const showSubmenuModeChanged = React.useCallback(
    (e) => {
      setShowFirstSubmenuModes(e.value);
    },
    [setShowFirstSubmenuModes],
  );
  const orientationChanged = React.useCallback(
    (e) => {
      setOrientation(e.value);
    },
    [setOrientation],
  );
  const hideSubmenuOnMouseLeaveChanged = React.useCallback(
    (e) => {
      setHideSubmenuOnMouseLeave(e.value);
    },
    [setHideSubmenuOnMouseLeave],
  );
  return (
    <div className="form">
      <div>
        <div className="label">Catalog:</div>
        <Menu
          dataSource={products}
          displayExpr="name"
          showFirstSubmenuMode={showFirstSubmenuModes}
          orientation={orientation}
          hideSubmenuOnMouseLeave={hideSubmenuOnMouseLeave}
          onItemClick={itemClick}
        />
        {currentProduct && (
          <div id="product-details">
            <img src={currentProduct.icon} />
            <div className="name">{currentProduct.name}</div>
            <div className="price">{`$${currentProduct.price}`}</div>
          </div>
        )}
      </div>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <div>Show First Submenu Mode</div>
          <SelectBox
            items={showSubmenuModes}
            displayExpr="name"
            inputAttr={showSubmenuModeLabel}
            value={showFirstSubmenuModes}
            onValueChanged={showSubmenuModeChanged}
          />
        </div>
        <div className="option">
          <div>Orientation</div>
          <SelectBox
            items={orientations}
            inputAttr={orientationLabel}
            value={orientation}
            onValueChanged={orientationChanged}
          />
        </div>
        <div className="option">
          <CheckBox
            text="Hide Submenu on Mouse Leave"
            value={hideSubmenuOnMouseLeave}
            onValueChanged={hideSubmenuOnMouseLeaveChanged}
          />
        </div>
      </div>
    </div>
  );
};
export default App;
