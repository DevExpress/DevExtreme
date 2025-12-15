import React, { useCallback, useState } from 'react';
import ActionSheet, { type ActionSheetTypes } from 'devextreme-react/action-sheet';
import Button from 'devextreme-react/button';
import Switch, { type SwitchTypes } from 'devextreme-react/switch';
import notify from 'devextreme/ui/notify';
import { actionSheetItems } from './data.ts';

const App = () => {
  const [isActionSheetVisible, setIsActionSheetVisible] = useState<boolean>(false);
  const [showTitle, setShowTitle] = useState<boolean>(true);
  const [showCancelButton, setShowCancelButton] = useState<boolean>(true);

  const showActionSheet = useCallback((): void => {
    setIsActionSheetVisible(true);
  }, [setIsActionSheetVisible]);

  const onActionSheetButtonClick = useCallback((buttonName: string): void => {
    setIsActionSheetVisible(false);
    notify(`The "${buttonName}" button is clicked.`);
  }, [setIsActionSheetVisible]);

  const onActionSheetItemClick = useCallback((e: ActionSheetTypes.ItemClickEvent): void => {
    onActionSheetButtonClick(e.itemData.text);
  }, [onActionSheetButtonClick]);

  const onActionSheetCancelClick = useCallback((): void => {
    onActionSheetButtonClick('Cancel');
  }, [onActionSheetButtonClick]);

  const changeTitle = useCallback((e: SwitchTypes.ValueChangedEvent): void => {
    setShowTitle(e.value);
  }, [setShowTitle]);

  const changeCancelButton = useCallback((e: SwitchTypes.ValueChangedEvent): void => {
    setShowCancelButton(e.value);
  }, [setShowCancelButton]);

  return (
    <div>
      <ActionSheet
        dataSource={actionSheetItems}
        title="Choose action"
        showTitle={showTitle}
        showCancelButton={showCancelButton}
        visible={isActionSheetVisible}
        onItemClick={onActionSheetItemClick}
        onCancelClick={onActionSheetCancelClick} />
      <div className="button">
        <Button width="100%" text="Click to show Action Sheet" onClick={showActionSheet} />
      </div>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <span>Show title</span>
          <Switch value={showTitle} onValueChanged={changeTitle} />
        </div>
        <div className="option">
          <span>Show cancel button</span>
          <Switch value={showCancelButton} onValueChanged={changeCancelButton} />
        </div>
      </div>
    </div>
  );
};

export default App;
