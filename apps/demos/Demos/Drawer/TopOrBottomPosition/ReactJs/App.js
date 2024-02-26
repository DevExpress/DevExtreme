import React, { useCallback, useMemo, useState } from 'react';
import Drawer from 'devextreme-react/drawer';
import RadioGroup from 'devextreme-react/radio-group';
import Toolbar from 'devextreme-react/toolbar';
import HTMLReactParser from 'html-react-parser';
import { text } from './data.js';
import NavigationList from './NavigationList.js';

const RadioGroupOpenedOptions = ['push', 'shrink', 'overlap'];
const RadioGroupPositionOptions = ['top', 'bottom'];
const RadioGroupRevealOptions = ['slide', 'expand'];
const App = () => {
  const [opened, setOpened] = useState(false);
  const [openedStateMode, setOpenedStateMode] = useState('shrink');
  const [revealMode, setRevealMode] = useState('expand');
  const [position, setPosition] = useState('top');
  const toolbarItems = useMemo(
    () => [
      {
        widget: 'dxButton',
        location: 'before',
        options: {
          icon: 'menu',
          stylingMode: 'text',
          onClick: () => setOpened(!opened),
        },
      },
    ],
    [opened, setOpened],
  );
  const onOpenedStateModeChanged = useCallback(
    ({ value }) => {
      setOpenedStateMode(value);
    },
    [setOpenedStateMode],
  );
  const onRevealModeChanged = useCallback(
    ({ value }) => {
      setRevealMode(value);
    },
    [setRevealMode],
  );
  const onPositionChanged = useCallback(
    ({ value }) => {
      setPosition(value);
    },
    [setPosition],
  );
  const onOutsideClick = useCallback(() => {
    setOpened(false);
    return false;
  }, [setOpened]);
  return (
    <div className="flex-container">
      <Toolbar
        items={toolbarItems}
        className="dx-theme-background-color"
      />
      <Drawer
        opened={opened}
        closeOnOutsideClick={onOutsideClick}
        openedStateMode={openedStateMode}
        position={position}
        component={NavigationList}
        revealMode={revealMode}
        height={400}
        maxSize={200}
      >
        <div
          id="content"
          className="dx-theme-background-color"
        >
          {HTMLReactParser(text)}
        </div>
      </Drawer>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <label>Opened state mode</label>
          <RadioGroup
            items={RadioGroupOpenedOptions}
            layout="horizontal"
            value={openedStateMode}
            onValueChanged={onOpenedStateModeChanged}
          />
        </div>{' '}
        <div className="option">
          <label>Position</label>
          <RadioGroup
            items={RadioGroupPositionOptions}
            layout="horizontal"
            value={position}
            onValueChanged={onPositionChanged}
          />
        </div>{' '}
        {openedStateMode !== 'push' && (
          <div className="option">
            <label>Reveal mode</label>
            <RadioGroup
              items={RadioGroupRevealOptions}
              layout="horizontal"
              value={revealMode}
              onValueChanged={onRevealModeChanged}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default App;
