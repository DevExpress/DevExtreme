import React from 'react';
import ActionSheet from 'devextreme-react/action-sheet';
import List from 'devextreme-react/list';

import notify from 'devextreme/ui/notify';

import RenderContactItem from './ContactItem.js';
import { actionSheetItems, contacts } from './data.js';

const App = () => {
  const [isActionSheetVisible, setIsActionSheetVisible] = React.useState(false);
  const [actionSheetTarget, setActionSheetTarget] = React.useState('');

  const onListItemClick = React.useCallback((e) => {
    setIsActionSheetVisible(true);
    setActionSheetTarget(e.itemElement);
  }, [setIsActionSheetVisible, setActionSheetTarget]);

  const onActionSheetItemClick = React.useCallback((e) => {
    setIsActionSheetVisible(false);
    notify(`The "${e.itemData.text}" button is clicked.`);
  }, [setIsActionSheetVisible]);

  const onVisibleChange = React.useCallback((isVisible) => {
    if (isVisible !== isActionSheetVisible) {
      setIsActionSheetVisible(isVisible);
    }
  }, [setIsActionSheetVisible]);

  return (
    <div className="app-container">
      <List
        id="list"
        items={contacts}
        itemRender={RenderContactItem}
        onItemClick={onListItemClick}
      />
      <ActionSheet
        title="Choose action"
        usePopover={true}
        visible={isActionSheetVisible}
        target={actionSheetTarget}
        items={actionSheetItems}
        onItemClick={onActionSheetItemClick}
        onVisibleChange={onVisibleChange}
      />
    </div>
  );
};

export default App;
