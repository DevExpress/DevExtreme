import React from 'react';
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
  const [opened, setOpened] = React.useState(true);
  const [openedStateMode, setOpenedStateMode] = React.useState<DrawerTypes.OpenedStateMode>('shrink');
  const [revealMode, setRevealMode] = React.useState<DrawerTypes.RevealMode>('slide');
  const [position, setPosition] = React.useState<DrawerTypes.PanelLocation>('left');

  const toolbarItems = React.useMemo(() => [{
    widget: 'dxButton',
    location: 'before',
    options: {
      icon: 'menu',
      onClick: () => setOpened(!opened),
    },
  }], [opened, setOpened]);

  const onOpenedStateModeChanged = React.useCallback(({ value }) => {
    setOpenedStateMode(value);
  }, [setOpenedStateMode]);

  const onRevealModeChanged = React.useCallback(({ value }) => {
    setRevealMode(value);
  }, [setRevealMode]);

  const onPositionChanged = React.useCallback(({ value }) => {
    setPosition(value);
  }, [setPosition]);

  const onOutsideClick = React.useCallback(() => {
    setOpened(false);
    return false;
  }, [setOpened]);

  return (
    <React.Fragment>
      <Toolbar items={toolbarItems} />
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
    </React.Fragment>
  );
};

export default App;
