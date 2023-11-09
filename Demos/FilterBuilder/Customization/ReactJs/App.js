import React from 'react';
import FilterBuilder, { CustomOperation } from 'devextreme-react/filter-builder';
import { filter, fields, groupOperations } from './data.js';
import { formatValue } from './helpers.js';
import { EditorComponent } from './EditorComponent.js';

function App() {
  const [value, setValue] = React.useState(filter);
  const [filterText, setFilterText] = React.useState('');
  const [dataSourceText, setDataSourceText] = React.useState('');
  const updateTexts = React.useCallback(
    (e) => {
      setFilterText(formatValue(e.component.option('value')));
      setDataSourceText(formatValue(e.component.getFilterExpression()));
    },
    [setFilterText, setDataSourceText],
  );
  const onValueChanged = React.useCallback(
    (e) => {
      setValue(e.value);
      updateTexts(e);
    },
    [updateTexts, setValue],
  );
  const calculateFilterExpression = React.useCallback(
    (filterValue, field) =>
      filterValue
      && filterValue.length
      && Array.prototype.concat
        .apply(
          [],
          filterValue.map((i) => [[field.dataField, '=', i], 'or']),
        )
        .slice(0, -1),
    [],
  );
  return (
    <div>
      <FilterBuilder
        fields={fields}
        value={value}
        onInitialized={updateTexts}
        groupOperations={groupOperations}
        onValueChanged={onValueChanged}
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
export default App;
