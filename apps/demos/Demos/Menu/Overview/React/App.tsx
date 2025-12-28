import React, { useCallback, useState } from 'react';

import { Menu, type MenuTypes } from 'devextreme-react/menu';
import { SelectBox, type SelectBoxTypes } from 'devextreme-react/select-box';
import { CheckBox, type CheckBoxTypes } from 'devextreme-react/check-box';

import { products } from './data.ts';
import type { Product, ProductItem } from './types.ts';

const orientations: MenuTypes.Orientation[] = ['horizontal', 'vertical'];
const orientationLabel = { 'aria-label': 'Orientation' };
const showSubmenuModeLabel = { 'aria-label': 'Show Submenu Mode' };

interface ShowSubmenuMode {
  name: MenuTypes.SubmenuShowMode,
  delay: {
    show: number,
    hide: number
  }
}
const showSubmenuModes: ShowSubmenuMode[] = [
  {
    name: 'onHover',
    delay: { show: 0, hide: 500 },
  },
  {
    name: 'onClick',
    delay: { show: 0, hide: 300 },
  },
];

const isProductItem = (item: Product | ProductItem | undefined): item is ProductItem =>
  !!item && !('items' in item);

const App = () => {
  const [showFirstSubmenuModes, setShowFirstSubmenuModes] = useState<ShowSubmenuMode>(showSubmenuModes[1]);
  const [orientation, setOrientation] = useState<MenuTypes.Orientation>('horizontal');
  const [hideSubmenuOnMouseLeave, setHideSubmenuOnMouseLeave] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<ProductItem | null>(null);

  const itemClick = useCallback((e: MenuTypes.ItemClickEvent<Product>): void => {
    if (isProductItem(e.itemData)) {
      setCurrentProduct(e.itemData);
    }
  }, []);

  const showSubmenuModeChanged = useCallback((e: SelectBoxTypes.ValueChangedEvent): void => {
    setShowFirstSubmenuModes(e.value);
  }, []);

  const orientationChanged = useCallback((e: SelectBoxTypes.ValueChangedEvent): void => {
    setOrientation(e.value);
  }, []);

  const hideSubmenuOnMouseLeaveChanged = useCallback((e: CheckBoxTypes.ValueChangedEvent): void => {
    setHideSubmenuOnMouseLeave(e.value);
  }, []);

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
            <img src={currentProduct.icon} alt="Product icon" />
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
