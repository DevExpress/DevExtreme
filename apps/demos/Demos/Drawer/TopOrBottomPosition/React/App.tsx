import React, { useCallback, useMemo, useState } from 'react';
import Drawer, { type DrawerTypes } from 'devextreme-react/drawer';
import RadioGroup, { type RadioGroupTypes } from 'devextreme-react/radio-group';
import Toolbar from 'devextreme-react/toolbar';
import HTMLReactParser from 'html-react-parser';
import { text } from './data.ts';
import NavigationList from './NavigationList.tsx';

const RadioGroupOpenedOptions: DrawerTypes.OpenedStateMode[] = ['push', 'shrink', 'overlap'];
const RadioGroupRevealOptions: DrawerTypes.RevealMode[] = ['slide', 'expand'];
const RadioGroupPositionOptions: DrawerTypes.PanelLocation[] = ['top', 'bottom'];

const App = () => {
  const [opened, setOpened] = useState<boolean>(false);
  const [openedStateMode, setOpenedStateMode] = useState<DrawerTypes.OpenedStateMode>('shrink');
  const [revealMode, setRevealMode] = useState<DrawerTypes.RevealMode>('expand');
  const [position, setPosition] = useState<DrawerTypes.PanelLocation>('top');

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
        closeOnOutsideClick={onOutsideClick}
        openedStateMode={openedStateMode}
        position={position}
        component={NavigationList}
        revealMode={revealMode}
        height={400}
        maxSize={200}
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
              items={RadioGroupOpenedOptions}
              layout="horizontal"
              value={openedStateMode}
              onValueChanged={onOpenedStateModeChanged}
            />
          </div>
          <div className="option">
            <label>Position</label>
            <RadioGroup
              items={RadioGroupPositionOptions}
              layout="horizontal"
              value={position}
              onValueChanged={onPositionChanged}
            />
          </div>
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
    </div>
  );
};

export default App;
