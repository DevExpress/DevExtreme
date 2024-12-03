import React, { useCallback, useState } from 'react';
import SelectBox, { SelectBoxTypes } from 'devextreme-react/select-box';
import CheckBox, { CheckBoxTypes } from 'devextreme-react/check-box';
import List, { ListTypes } from 'devextreme-react/list';
import { tasks, deleteModeLabel } from './data.ts';

const itemDeleteModes = ['static', 'toggle', 'slideButton', 'slideItem', 'swipe', 'context'];

const App = () => {
  const [allowDeletion, setAllowDeletion] = useState(false);
  const [itemDeleteMode, setItemDeleteMode] = useState<ListTypes.Properties['itemDeleteMode']>('toggle');

  const onAllowDeletionChange = useCallback((args: CheckBoxTypes.ValueChangedEvent) => {
    setAllowDeletion(args.value);
  }, [setAllowDeletion]);

  const onItemDeleteModeChange = useCallback((args: SelectBoxTypes.ValueChangedEvent) => {
    setItemDeleteMode(args.value);
  }, [setItemDeleteMode]);

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};

export default App;
