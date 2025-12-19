import React, { useCallback, useState } from 'react';
import SelectBox from 'devextreme-react/select-box';
import type { SelectBoxTypes } from 'devextreme-react/select-box';
import CheckBox from 'devextreme-react/check-box';
import type { CheckBoxTypes } from 'devextreme-react/check-box';
import List from 'devextreme-react/list';
import type { ListTypes } from 'devextreme-react/list';
import { tasks, deleteModeLabel } from './data.ts';

const itemDeleteModes: ListTypes.ItemDeleteMode[] = ['static', 'toggle', 'slideButton', 'slideItem', 'swipe', 'context'];

const App = () => {
  const [allowDeletion, setAllowDeletion] = useState<boolean>(false);
  const [itemDeleteMode, setItemDeleteMode] = useState<ListTypes.ItemDeleteMode>('toggle');

  const onAllowDeletionChange = useCallback((args: CheckBoxTypes.ValueChangedEvent): void => {
    setAllowDeletion(args.value);
  }, []);

  const onItemDeleteModeChange = useCallback((args: SelectBoxTypes.ValueChangedEvent): void => {
    setItemDeleteMode(args.value);
  }, []);

  return (
    <>
      <div className="widget-container">
        <List
          dataSource={tasks}
          height={400}
          allowItemDeleting={allowDeletion}
          itemDeleteMode={itemDeleteMode}
        />
      </div>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <CheckBox
            text="Allow deletion"
            value={allowDeletion}
            onValueChanged={onAllowDeletionChange}
          />
        </div>
        <div className="option">
          <span>Item delete mode </span>
          <SelectBox
            disabled={!allowDeletion}
            items={itemDeleteModes}
            inputAttr={deleteModeLabel}
            value={itemDeleteMode}
            onValueChanged={onItemDeleteModeChange}
          />
        </div>
      </div>
    </>
  );
};

export default App;
