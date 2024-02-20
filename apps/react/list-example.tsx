/* eslint-disable max-classes-per-file */
import * as React from 'react';
import DataSource from 'devextreme/data/data_source';
import { Button } from 'devextreme-react/button';
import { List, Item as ListItem } from 'devextreme-react/list';
import { TextBox } from 'devextreme-react/text-box';

import Example from './example-block';

interface IListItemProps {
  data: {
    text: string;
  };
  index: number;
}

const items: IListItemProps[] = [
  { text: '123' },
  { text: '234' },
  { text: '567' },
];

class Item extends React.Component<IListItemProps, { counter: number }> {
  constructor(props: IListItemProps) {
    super(props);
    this.state = {
      counter: 0,
    };

    this.handleClick = this.handleClick.bind(this);
  }

  private handleClick() {
    const { counter } = this.state;
    this.setState({
      counter: counter + 1,
    });
  }

  public render() {
    const { data: { text }, index } = this.props;
    const { counter } = this.state;
    return (
      <button type="button" onClick={this.handleClick}>
        {index + 1}
        . Component template for item
        {text}
        .
        <b>
          Clicks:
          {counter}
        </b>
      </button>
    );
  }
}

function ItemKeyGetter(data: any) {
  return data.text;
}

function ItemsRender(item: string) {
  return <i>{item}</i>;
}

const listItems: string[] = ['orange', 'apple', 'potato'];

export default class extends React.Component<any, { text: string; items: IListItemProps[]; }> {
  private dataSource: DataSource;

  constructor(props: unknown) {
    super(props);
    this.state = {
      text: '',
      items,
    };

    this.dataSource = new DataSource(
      {
        store: {
          type: 'array',
          data: items,
        },
        sort: [
          { getter: 'text', desc: true },
        ],
        pageSize: 1,
      },
    );

    this.updateText = this.updateText.bind(this);
    this.addTextToList = this.addTextToList.bind(this);
  }

  public componentWillUnmount(): void {
    this.dataSource.dispose();
  }

  private updateText(e: any) {
    this.setState({
      text: e.value,
    });
  }

  private addTextToList() {
    const { items: stateItems, text } = this.state;
    this.setState({
      items: [...stateItems, { text }],
      text: '',
    });
  }

  public render(): React.ReactNode {
    const { items: stateItems, text } = this.state;
    return (
      <Example title="DxList" state={this.state}>
        <hr />
        <h4>List with inline items</h4>
        <List>
          <ListItem>abc</ListItem>
          <ListItem>def</ListItem>
          <ListItem>ghi</ListItem>
        </List>
        <hr />
        <h4>List with function template</h4>
        <List
          items={listItems}
          itemRender={ItemsRender}
        />
        <hr />
        <h4>List with component template</h4>
        <List
          repaintChangesOnly
          items={stateItems}
          itemComponent={Item}
          itemKeyFn={ItemKeyGetter}
        />

        <hr />
        <h4>List with dataSource</h4>
        <List dataSource={this.dataSource} />
        <hr />
        <TextBox value={text} onValueChanged={this.updateText} valueChangeEvent="input" />
        <Button text="Add to list" onClick={this.addTextToList} />
      </Example>
    );
  }
}
