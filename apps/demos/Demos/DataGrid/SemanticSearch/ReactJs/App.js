import React, { useCallback, useRef, useMemo } from 'react';
import DataGrid, {
  Column,
  Scrolling,
  SearchPanel,
  Toolbar,
  Item,
} from 'devextreme-react/data-grid';
import NumberBox from 'devextreme-react/number-box';
import DataSource from 'devextreme/data/data_source';
import { createStore } from 'devextreme-aspnet-data-nojquery';

const url = 'https://js.devexpress.com/Demos/NetCore/api/DataGridSemanticSearch';
const App = () => {
  const searchValueRef = useRef('');
  const similarityFactorRef = useRef(0.31);
  const dataSource = useMemo(
    () =>
      new DataSource({
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
        }),
      }),
    [],
  );
  const onSimilarityFactorChanged = useCallback(
    ({ value }) => {
      similarityFactorRef.current = value;
      if (searchValueRef.current !== '') {
        dataSource.reload();
      }
    },
    [dataSource],
  );
  const onEditorPreparing = useCallback((e) => {
    if (e.parentType === 'searchPanel') {
      let searchTimeout;
      e.editorOptions.onValueChanged = (args) => {
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
        <Item
          location="after"
          cssClass="align-bottom"
        >
          <NumberBox
            label="Similarity Factor"
            labelMode="floating"
            defaultValue={similarityFactorRef.current}
            min={0}
            max={1}
            format="0.00"
            step={0.05}
            onValueChanged={onSimilarityFactorChanged}
          />
        </Item>
        <Item
          name="searchPanel"
          cssClass="align-bottom"
        />
      </Toolbar>
      <Column
        dataField="ID"
        key="ID"
      />
      <Column
        dataField="Name"
        key="Name"
      />
      <Column
        dataField="Description"
        key="Description"
      />
    </DataGrid>
  );
};
export default App;
