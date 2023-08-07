import React from 'react';
import { ButtonGroup } from 'devextreme-react/button-group';
import notify from 'devextreme/ui/notify';
import { alignments, fontStyles } from './data.js';

const selectedItemKeys = ['left'];

const itemClick = (e) => {
  notify({ message: `The "${e.itemData.hint}" button was clicked`, width: 320 }, 'success', 1000);
};

export default function App() {
  return (
    <div>
      <div className="buttongroups-container">
        <ButtonGroup
          items={alignments}
          keyExpr="alignment"
          stylingMode="outlined"
          selectedItemKeys={selectedItemKeys}
          onItemClick={itemClick}
        />
        <ButtonGroup
          items={fontStyles}
          keyExpr="style"
          stylingMode="outlined"
          selectionMode="multiple"
          onItemClick={itemClick}
        />
      </div>
      <div className="buttongroups-container">
        <ButtonGroup
          items={alignments}
          keyExpr="alignment"
          stylingMode="text"
          selectedItemKeys={selectedItemKeys}
          onItemClick={itemClick}
        />
        <ButtonGroup
          className="multiple-selection-styling-mode"
          items={fontStyles}
          keyExpr="style"
          stylingMode="text"
          selectionMode="multiple"
          onItemClick={itemClick}
        />
      </div>
    </div>
  );
}
