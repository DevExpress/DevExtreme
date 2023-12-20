import React, { useCallback, useState } from 'react';
import ActionSheet from 'devextreme-react/action-sheet';
import List from 'devextreme-react/list';
import notify from 'devextreme/ui/notify';
import RenderContactItem from './ContactItem.js';
import { actionSheetItems, contacts } from './data.js';

const App = () => {
  const [isActionSheetVisible, setIsActionSheetVisible] = useState(false);
  const [actionSheetTarget, setActionSheetTarget] = useState('');
  const onListItemClick = useCallback(
    (e) => {
      setIsActionSheetVisible(true);
      setActionSheetTarget(e.itemElement);
    },
    [setIsActionSheetVisible, setActionSheetTarget],
  );
  const onActionSheetItemClick = useCallback(
    (e) => {
      setIsActionSheetVisible(false);
      notify(`The "${e.itemData.text}" button is clicked.`);
    },
    [setIsActionSheetVisible],
  );
  const onVisibleChange = useCallback(
    (isVisible) => {
      if (isVisible !== isActionSheetVisible) {
        setIsActionSheetVisible(isVisible);
      }
    },
    [setIsActionSheetVisible, isActionSheetVisible],
  );
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
