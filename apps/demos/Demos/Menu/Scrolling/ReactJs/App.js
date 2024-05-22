import React, { useCallback, useState } from 'react';
import Menu from 'devextreme-react/menu';
import CheckBox from 'devextreme-react/check-box';
import notify from 'devextreme/ui/notify';
import service from './data.js';

const SUBMENU_HEIGHT = 200;
const products = service.getProducts();
const App = () => {
  const [limitSubmenuHeight, setLimitSubmenuHeight] = useState(false);
  const itemClick = useCallback((e) => {
    if (!e.itemData.items) {
      notify(`The "${e.itemData.text}" item was clicked`, 'success', 1500);
    }
  }, []);
  const limitSubmenuHeightOnMouseClick = useCallback(
    (e) => {
      setLimitSubmenuHeight(e.value);
    },
    [setLimitSubmenuHeight],
  );
  const onSubmenuShowing = useCallback(
    ({ submenuContainer }) => {
      submenuContainer.style.maxHeight = limitSubmenuHeight ? `${SUBMENU_HEIGHT}px` : '';
    },
    [limitSubmenuHeight],
  );
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
