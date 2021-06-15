import * as React from 'react';
import FilterBuilder, { CustomOperation } from 'devextreme-react/filter-builder';
import { filter, fields, groupOperations } from './editor-data';
import { formatValue } from './helpers';
import EditorComponent from './editor-component';

function calculateFilterExpression(filterValue, field) {
  return filterValue && filterValue.length
    && Array.prototype.concat.apply([], filterValue.map((value) => [[field.dataField, '=', value], 'or'])).slice(0, -1);
}

class DateBoxExample extends React.Component<any, {
  value: string[][],
  filterText: string,
  dataSourceText:string
}> {
  constructor(props) {
    super(props);
    this.state = {
      value: filter,
      filterText: '',
      dataSourceText: '',
    };
    this.onValueChanged = this.onValueChanged.bind(this);
    this.updateTexts = this.updateTexts.bind(this);
  }

  onValueChanged(e) {
    this.setState({ value: e.value });
    this.updateTexts(e);
  }

  updateTexts(e) {
    this.setState({
      filterText: formatValue(e.component.option('value'), 0),
      dataSourceText: formatValue(e.component.getFilterExpression(), 0),
    });
  }

  render(): React.ReactNode {
    const { value, dataSourceText, filterText } = this.state;

    return (
      <div>
        <FilterBuilder
          fields={fields}
          value={value}
          onInitialized={this.updateTexts}
          groupOperations={groupOperations}
          onValueChanged={this.onValueChanged}
        >
          <CustomOperation
            name="anyof"
            caption="Is any of"
            icon="check"
            editorComponent={EditorComponent}
            calculateFilterExpression={calculateFilterExpression}
          />
        </FilterBuilder>
        <div className="results">
          <div>
            <b>Value</b>
            <pre>{filterText}</pre>
          </div>
          <div>
            <b>DataSource&apos;s filter expression</b>
            <pre>{dataSourceText}</pre>
          </div>
        </div>
      </div>
    );
  }
}

export default DateBoxExample;
