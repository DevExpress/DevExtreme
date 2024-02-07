import React, { useCallback, useMemo, useState } from 'react';
import Drawer, { DrawerTypes } from 'devextreme-react/drawer';
import RadioGroup from 'devextreme-react/radio-group';
import Toolbar from 'devextreme-react/toolbar';
import HTMLReactParser from 'html-react-parser';
import { text } from './data.ts';
import NavigationList from './NavigationList.tsx';

const openedStateModes = ['push', 'shrink', 'overlap'];
const positions = ['left', 'right'];
const revealModes = ['slide', 'expand'];

const App = () => {
  const [opened, setOpened] = useState(true);
  const [openedStateMode, setOpenedStateMode] = useState<DrawerTypes.OpenedStateMode>('shrink');
  const [revealMode, setRevealMode] = useState<DrawerTypes.RevealMode>('slide');
  const [position, setPosition] = useState<DrawerTypes.PanelLocation>('left');

  const toolbarItems = useMemo(() => [{
    widget: 'dxButton',
    location: 'before',
    options: {
      icon: 'menu',
      stylingMode: 'text',
      onClick: () => setOpened(!opened),
    },
  }], [opened, setOpened]);

  const onOpenedStateModeChanged = useCallback(({ value }) => {
    setOpenedStateMode(value);
  }, [setOpenedStateMode]);

  const onRevealModeChanged = useCallback(({ value }) => {
    setRevealMode(value);
  }, [setRevealMode]);

  const onPositionChanged = useCallback(({ value }) => {
    setPosition(value);
  }, [setPosition]);

  const onOutsideClick = useCallback(() => {
    setOpened(false);
    return false;
  }, [setOpened]);

  return (
    <div className="flex-container">
      <Toolbar items={toolbarItems} id="toolbar" className="dx-theme-background-color" />
      <Drawer
        opened={opened}
        openedStateMode={openedStateMode}
        position={position}
        revealMode={revealMode}
        component={NavigationList}
        closeOnOutsideClick={onOutsideClick}
        height={400}
      >
        <div id="content" className="dx-theme-background-color">
          {HTMLReactParser(text)}
        </div>
      </Drawer>
      <div className="options">
        <div className="caption">Options</div>
        <div className="options-container">
          <div className="option">
            <label>Opened state mode</label>
            <RadioGroup
              items={openedStateModes}
              layout="horizontal"
              value={openedStateMode}
              onValueChanged={onOpenedStateModeChanged}
            />
          </div>
          <div className="option">
            <label>Position</label>
            <RadioGroup
              items={positions}
              layout="horizontal"
              value={position}
              onValueChanged={onPositionChanged}
            />
          </div>
          {openedStateMode !== 'push' && (
            <div className="option">
              <label>Reveal mode</label>
              <RadioGroup
                items={revealModes}
                layout="horizontal"
                value={revealMode}
                onValueChanged={onRevealModeChanged}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
