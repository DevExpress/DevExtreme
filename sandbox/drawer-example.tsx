import * as React from 'react';

import Drawer from 'devextreme-react/src/ui/drawer';
import RadioGroup from 'devextreme-react/radio-group';
import Toolbar from 'devextreme-react/toolbar';
import Example from './example-block';

import NavigationList from './NavigationList';

class App extends React.Component<any, {
  opened: boolean,
  openedStateMode: 'shrink' | 'overlap' | 'push' | undefined,
  revealMode: 'slide' | 'expand' | undefined,
  position: 'left' | 'before' | 'right' | 'top' | 'bottom' | 'after' | undefined
}> {
  constructor(props: any) {
    super(props);

    this.state = {
      opened: true,
      openedStateMode: 'shrink',
      revealMode: 'slide',
      position: 'left',
    };

    this.onOpenedStateModeChanged = this.onOpenedStateModeChanged.bind(this);
    this.onRevealModeChanged = this.onRevealModeChanged.bind(this);
    this.onPositionChanged = this.onPositionChanged.bind(this);
    this.onPositionChanged = this.onPositionChanged.bind(this);
    this.onOutsideClick = this.onOutsideClick.bind(this);
    this.onMenuClick = this.onMenuClick.bind(this);
  }

  render() {
    const {
      opened, openedStateMode, position, revealMode,
    } = this.state;

    const toolbarItems: Object[] = [{
      widget: 'dxButton',
      location: 'before',
      options: {
        icon: 'menu',
        onClick: this.onMenuClick,
      },
    }];

    return (
      <Example title="DxDrawer" state={this.state}>
        <Toolbar items={toolbarItems} />
        <Drawer
          opened={opened}
          openedStateMode={openedStateMode}
          position={position}
          revealMode={revealMode}
          component={NavigationList}
          closeOnOutsideClick={this.onOutsideClick}
          height={400}
        >
          <div id="content" className="dx-theme-background-color">
            <div>
              Lorem ipsum dolor sit amet consectetur,
              adipisicing elit. Corrupti fugit culpa similique non illum doloremque,
              odio aperiam enim nostrum laboriosam accusantium delectus tempora nesciunt,
              repellendus explicabo laudantium nam. Non, officiis!
            </div>
          </div>
        </Drawer>
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <label>Opened state mode</label>
            <RadioGroup
              items={['push', 'shrink', 'overlap']}
              layout="horizontal"
              value={openedStateMode}
              onValueChanged={this.onOpenedStateModeChanged}
            />
          </div>
          {' '}
          <div className="option">
            <label>Position</label>
            <RadioGroup
              items={['left', 'right']}
              layout="horizontal"
              value={position}
              onValueChanged={this.onPositionChanged}
            />
          </div>
          {' '}
          {openedStateMode !== 'push' && (
            <div className="option">
              <label>Reveal mode</label>
              <RadioGroup
                items={['slide', 'expand']}
                layout="horizontal"
                value={revealMode}
                onValueChanged={this.onRevealModeChanged}
              />
            </div>
          )}
        </div>
      </Example>
    );
  }

  onOpenedStateModeChanged({ value }) {
    this.setState({ openedStateMode: value });
  }

  onRevealModeChanged({ value }) {
    this.setState({ revealMode: value });
  }

  onPositionChanged({ value }) {
    this.setState({ position: value });
  }

  onOutsideClick() {
    this.setState({ opened: false });
  }

  onMenuClick() {
    this.setState((prevState) => ({ opened: !prevState }));
  }
}

export default App;
