import React from 'react';
import { TagBox } from 'devextreme-react';
import { categories } from './data.js';

export class EditorComponent extends React.Component {
  constructor(props) {
    super(props);
    this.onValueChanged = this.onValueChanged.bind(this);
  }
  render() {
    return (
      <TagBox
        defaultValue={this.props.data.value}
        items={categories}
        onValueChanged={this.onValueChanged}
        width="auto"
      />
    );
  }
  onValueChanged(e) {
    this.props.setValue(e.value && e.value.length ? e.value : null);
  }
}
