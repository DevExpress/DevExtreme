/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-webpack-loader-syntax */
import React, { useState } from 'react';
import DataGrid, { Column, Editing, FilterRow } from 'devextreme-react/data-grid';
import SelectBox from 'devextreme-react/select-box';
import deMessages from 'devextreme/localization/messages/de.json';
import ruMessages from 'devextreme/localization/messages/ru.json';
import { locale, loadMessages, formatMessage } from 'devextreme/localization';
import service from './data.js';

const editPopupOptions = {
  width: 700,
  height: 345,
};
const amountEditorOptions = {
  format: 'currency',
  showClearButton: true,
};
const selectBoxInputAttr = { id: 'selectInput' };
locale(sessionStorage.getItem('locale') || 'en');
loadMessages(deMessages);
loadMessages(ruMessages);
loadMessages(service.getDictionary());
const App = () => {
  const [localeState, setLocaleState] = useState(sessionStorage.getItem('locale') || 'en');
  const locales = service.getLocales();
  const payments = service.getPayments();
  const changeLocale = (e) => {
    sessionStorage.setItem('locale', e.value);
    setLocaleState(e.value);
    document.location.reload();
  };
  return (
    <div>
      <DataGrid
        dataSource={payments}
        keyExpr="PaymentId"
      >
        <Editing
          mode="popup"
          allowUpdating={true}
          popup={editPopupOptions}
        />
        <FilterRow
          visible={true}
          applyFilter="auto"
        />
        <Column
          dataField="PaymentId"
          caption={formatMessage('Number')}
          allowEditing={false}
          width={100}
        />
        <Column
          dataField="ContactName"
          caption={formatMessage('Contact')}
        />
        <Column
          dataField="CompanyName"
          caption={formatMessage('Company')}
        />
        <Column
          dataField="Amount"
          caption={formatMessage('Amount')}
          dataType="number"
          format="currency"
          editorOptions={amountEditorOptions}
        />
        <Column
          dataField="PaymentDate"
          caption={formatMessage('PaymentDate')}
          dataType="date"
        />
      </DataGrid>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <label htmlFor="selectInput">Language</label>
          &nbsp;
          <SelectBox
            items={locales}
            valueExpr="Value"
            displayExpr="Name"
            value={localeState}
            onValueChanged={changeLocale}
            inputAttr={selectBoxInputAttr}
          />
        </div>
      </div>
    </div>
  );
};
export default App;
