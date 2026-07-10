import React, { useCallback, useRef, useMemo } from 'react';
import DataGrid, { Column, Scrolling, SearchPanel, Toolbar, Item, type DataGridTypes } from 'devextreme-react/data-grid';
import NumberBox, { type NumberBoxTypes } from 'devextreme-react/number-box';
import DataSource from 'devextreme/data/data_source';
import { createStore } from 'devextreme-aspnet-data-nojquery';

const url = 'https://js.devexpress.com/Demos/NetCore/api/DataGridSemanticSearch';
const numberBoxAttr = { 'aria-label': 'Similarity Factor' };

const App = () => {
  const searchValueRef = useRef<string>('');
  const similarityFactorRef = useRef<number>(0.31);

  const dataSource = useMemo<DataSource>(() => new DataSource({
    store: createStore({
      key: 'ID',
      loadUrl: `${url}/Get`,
      loadParams: {
        searchValue: () => searchValueRef.current,
        similarityFactor: () => similarityFactorRef.current,
      },
      onBeforeSend(method, ajaxOptions) {
        ajaxOptions.xhrFields = { withCredentials: true };
      },
    })
  }), []);

  const onSimilarityFactorChanged = useCallback(({ value }: NumberBoxTypes.ValueChangedEvent) => {
    similarityFactorRef.current = value;
    if (searchValueRef.current !== '') {
      dataSource.reload();
    }
  }, [dataSource]);

  const onEditorPreparing = useCallback((e: DataGridTypes.EditorPreparingEvent) => {
    if (e.parentType === 'searchPanel') {
      let searchTimeout: ReturnType<typeof setTimeout> | undefined;
      e.editorOptions.onValueChanged = (args: { value: string }) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          searchValueRef.current = args.value;
          e.component.getDataSource().reload();
        }, e.updateValueTimeout);
      };
      e.editorOptions.placeholder = 'Try: clothing';
    }
  }, []);

  return (
    <DataGrid
      dataSource={dataSource}
      showBorders={true}
      remoteOperations={true}
      height={600}
      onEditorPreparing={onEditorPreparing}
    >
      <Scrolling mode="virtual" />
      <SearchPanel visible={true} />
      <Toolbar>
        <Item location="before">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '8px' }}>Similarity Factor:</span>
            <NumberBox
              defaultValue={similarityFactorRef.current}
              min={0}
              max={1}
              format="0.00"
              step={0.05}
              showSpinButtons={true}
              inputAttr={numberBoxAttr}
              onValueChanged={onSimilarityFactorChanged}
            />
          </div>
        </Item>
        <Item name="searchPanel" />
      </Toolbar>
      <Column dataField="ID" key="ID" width={50} />
      <Column dataField="Name" key="Name" />
      <Column dataField="Description" key="Description" />
    </DataGrid>
  );
};

export default App;
