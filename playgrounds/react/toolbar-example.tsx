import * as React from 'react';
import { Button } from 'devextreme-react/button';
import { Toolbar } from 'devextreme-react/toolbar';
import Example from './example-block';

const ItemComponent = (data: { data: { text: string } }) => (
  <Button text={data.data.text} />
);

const items = [{ text: 'Text' }, { text: 'Text2' }];

export default class extends React.Component<any, any> {
  public render(): React.ReactNode {
    return (
      <Example title="Toolbar" state={this.state}>
        <Toolbar items={items} itemComponent={ItemComponent} />
      </Example>
    );
  }
}
