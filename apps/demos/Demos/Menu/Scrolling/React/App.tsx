import React, { useCallback, useState } from 'react';

import Menu, { type MenuTypes } from 'devextreme-react/menu';
import CheckBox, { type CheckBoxTypes } from 'devextreme-react/check-box';
import notify from 'devextreme/ui/notify';

import { products } from './data.ts';
import type { Product } from './types';

const SUBMENU_HEIGHT = 200;

const App = () => {
  const [limitSubmenuHeight, setLimitSubmenuHeight] = useState<boolean>(false);

  const itemClick = useCallback((e: MenuTypes.ItemClickEvent<Product>): void => {
    if (!e.itemData?.items) {
      notify(`The "${e.itemData?.text}" item was clicked`, 'success', 1500);
    }
  }, []);

  const limitSubmenuHeightOnMouseClick = useCallback((e: CheckBoxTypes.ValueChangedEvent): void => {
    setLimitSubmenuHeight(e.value);
  }, []);

  const onSubmenuShowing = useCallback((e: MenuTypes.SubmenuShowingEvent<Product>): void => {
    if (!e.submenuContainer) {
      return;
    }
    e.submenuContainer.style.maxHeight = limitSubmenuHeight ? `${SUBMENU_HEIGHT}px` : '';
  }, [limitSubmenuHeight]);

  return (
    <div className="demo-container">
      <div className="content">
        <div className="label">Catalog:</div>
        <Menu
          dataSource={products}
          onItemClick={itemClick}
          onSubmenuShowing={onSubmenuShowing}
        />
      </div>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <CheckBox
            text={`Limit submenu height to ${SUBMENU_HEIGHT}px`}
            value={limitSubmenuHeight}
            onValueChanged={limitSubmenuHeightOnMouseClick}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
