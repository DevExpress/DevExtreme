import React, { useCallback, useMemo, useState } from 'react';
import Drawer from 'devextreme-react/drawer';
import type { DrawerTypes } from 'devextreme-react/drawer';
import RadioGroup from 'devextreme-react/radio-group';
import type { RadioGroupTypes } from 'devextreme-react/radio-group';
import Toolbar from 'devextreme-react/toolbar';
import HTMLReactParser from 'html-react-parser';
import { text } from './data.ts';
import NavigationList from './NavigationList.tsx';

const openedStateModes: DrawerTypes.OpenedStateMode[] = ['push', 'shrink', 'overlap'];
const revealModes: DrawerTypes.RevealMode[] = ['slide', 'expand'];
const positions: DrawerTypes.PanelLocation[] = ['left', 'right'];

const App = () => {
  const [opened, setOpened] = useState<boolean>(true);
  const [openedStateMode, setOpenedStateMode] = useState<DrawerTypes.OpenedStateMode>('shrink');
  const [revealMode, setRevealMode] = useState<DrawerTypes.RevealMode>('slide');
  const [position, setPosition] = useState<DrawerTypes.PanelLocation>('left');

  const toolbarItems = useMemo(() => [{
    widget: 'dxButton',
    location: 'before',
    options: {
      icon: 'menu',
      stylingMode: 'text',
      onClick: (): void => setOpened((opened: boolean): boolean => !opened),
    },
  }], []);

  const onOpenedStateModeChanged = useCallback(({ value }: RadioGroupTypes.ValueChangedEvent): void => {
    setOpenedStateMode(value);
  }, []);

  const onRevealModeChanged = useCallback(({ value }: RadioGroupTypes.ValueChangedEvent): void => {
    setRevealMode(value);
  }, []);

  const onPositionChanged = useCallback(({ value }: RadioGroupTypes.ValueChangedEvent): void => {
    setPosition(value);
  }, []);

  const onOutsideClick = useCallback((): boolean => {
    setOpened(false);
    return false;
  }, []);

  return (
    <div className="flex-container">
      <Toolbar items={toolbarItems} id="toolbar" />
      <Drawer
        opened={opened}
        openedStateMode={openedStateMode}
        position={position}
        revealMode={revealMode}
        component={NavigationList}
        closeOnOutsideClick={onOutsideClick}
        height={400}
      >
        <div id="content">
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
