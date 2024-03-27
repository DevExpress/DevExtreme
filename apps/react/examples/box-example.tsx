import * as React from 'react';
import { Box, Item } from 'devextreme-react/box';
import { Button } from 'devextreme-react/button';
import Example from './example-block';

const initialState = {
  items: [
    {
      id: 1,
      name: 'Item #1',
    },
    {
      id: 2,
      name: 'Item #2',
    },
  ],
};

class App extends React.Component<any, typeof initialState> {
  constructor(props: unknown) {
    super(props);

    this.state = { ...initialState };
  }

  private renderItems = () => {
    const { items } = this.state;
    return items.map((item) => (
      <Item key={item.id} ratio={1}>
        {item.name}
      </Item>
    ));
  };

  private add = () => {
    const { items: stateItems } = this.state;
    const items = [...stateItems];
    const id = items.length ? items[items.length - 1].id + 1 : 1;
    items.push({
      id,
      name: `Item #${id}`,
    });

    this.setState({ items });
  };

  private remove = () => {
    const { items: stateItems } = this.state;
    const items = stateItems.slice(0, stateItems.length - 1);
    this.setState({ items });
  };

  public render(): React.ReactNode {
    return (
      <Example title="Box example">
        <Button
          text="Add"
          onClick={this.add}
        />
        <Button
          text="Remove"
          onClick={this.remove}
        />
        <Box direction="row" width="100%" height={75}>
          {this.renderItems()}
        </Box>
      </Example>
    );
  }
}

export default App;
