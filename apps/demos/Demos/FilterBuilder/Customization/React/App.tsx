import React, { useCallback, useState } from 'react';
import FilterBuilder, { CustomOperation, FilterBuilderTypes, ICustomOperationProps } from 'devextreme-react/filter-builder';
import { filter, fields, groupOperations } from './data.ts';
import { formatValue } from './helpers.ts';
import { EditorComponent } from './EditorComponent.tsx';

function App() {
  const [value, setValue] = useState(filter);
  const [filterText, setFilterText] = useState('');
  const [dataSourceText, setDataSourceText] = useState('');

  const updateTexts = useCallback((e: FilterBuilderTypes.InitializedEvent) => {
    setFilterText(formatValue(e.component.option('value')));
    setDataSourceText(formatValue(e.component.getFilterExpression()));
  }, [setFilterText, setDataSourceText]);

  const onValueChanged = useCallback((e: FilterBuilderTypes.ValueChangedEvent) => {
    setValue(e.value);
    updateTexts(e);
  }, [updateTexts, setValue]);

  const calculateFilterExpression: ICustomOperationProps['calculateFilterExpression'] = useCallback((filterValue, field) => (
    filterValue
      && filterValue.length
      && Array.prototype.concat
        .apply(
          [],
          filterValue.map((i) => [[field.dataField, '=', i], 'or']),
        )
        .slice(0, -1)
  ), []);

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
