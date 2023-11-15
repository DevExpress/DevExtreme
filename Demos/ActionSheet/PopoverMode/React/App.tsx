import React from 'react';
import ActionSheet, { ActionSheetTypes } from 'devextreme-react/action-sheet';
import List, { ListTypes } from 'devextreme-react/list';

import notify from 'devextreme/ui/notify';

import RenderContactItem from './ContactItem.tsx';
import { actionSheetItems, contacts } from './data.ts';

const App = () => {
  const [isActionSheetVisible, setIsActionSheetVisible] = React.useState(false);
  const [actionSheetTarget, setActionSheetTarget] = React.useState<HTMLElement | string>('');

  const onListItemClick = React.useCallback((e: ListTypes.ItemClickEvent) => {
    setIsActionSheetVisible(true);
    setActionSheetTarget(e.itemElement);
  }, [setIsActionSheetVisible, setActionSheetTarget]);

  const onActionSheetItemClick = React.useCallback((e: ActionSheetTypes.ItemClickEvent) => {
    setIsActionSheetVisible(false);
    notify(`The "${e.itemData.text}" button is clicked.`);
  }, [setIsActionSheetVisible]);

  const onVisibleChange = React.useCallback((isVisible: boolean) => {
    if (isVisible !== isActionSheetVisible) {
      setIsActionSheetVisible(isVisible);
    }
  }, [setIsActionSheetVisible, isActionSheetVisible]);

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
