import * as React from 'react';
import {
  Button, SlideOutView, Template, Toolbar,
} from 'devextreme-react';
import Example from './example-block';

function renderMenuTemplate() {
  const items = [{
    location: 'before',
    locateInMenu: 'auto',
    widget: 'dxButton',
    options: {
      icon: 'menu',
    },
  }, {
    location: 'center',
    locateInMenu: 'auto',
    template: 'menuTextTemplate',
  }];

  return (
    <>
      <Toolbar items={items}>
        <Template name="menuTextTemplate" render={() => <h4>Demo</h4>} />
      </Toolbar>
    </>
  );
}

export default class extends React.Component<any, any> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      menuVisible: true,
    };
    this._optionChangeHandler = this._optionChangeHandler.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  public toggle(): void {
    const { menuVisible } = this.state;
    this.setState({ menuVisible: !menuVisible });
  }

  private _optionChangeHandler(args: { name: string, value: any }) {
    if (args.name === 'menuVisible') {
      this.setState({ menuVisible: args.value });
    }
  }

  public render(): React.ReactNode {
    const { menuVisible } = this.state;
    return (
      <Example title="DxSlideOutView" state={this.state}>
        <Button text="toggle" onClick={this.toggle} />
        <SlideOutView
          height={200}
          swipeEnabled
          menuVisible={menuVisible}
          menuRender={renderMenuTemplate}
          onOptionChanged={this._optionChangeHandler}
        >
          This is SlideOutView content
        </SlideOutView>
      </Example>
    );
  }
}
