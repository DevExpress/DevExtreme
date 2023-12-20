import React, { useCallback, useState } from 'react';
import ODataStore from 'devextreme/data/odata/store';
import { Autocomplete, AutocompleteTypes } from 'devextreme-react/autocomplete';
import CustomStore from 'devextreme/data/custom_store';
import 'whatwg-fetch';
import { names, surnames, positions } from './data.ts';

function isNotEmpty(value: string) {
  return value !== undefined && value !== null && value !== '';
}

const position = positions[0];

const states = new ODataStore({
  version: 2,
  url: 'https://js.devexpress.com/Demos/DevAV/odata/States?$select=Sate_ID,State_Long,State_Short',
  key: 'Sate_ID',
  keyType: 'Int32',
});

const clientsStore = new CustomStore({
  key: 'Value',
  useDefaultSearch: true,
  load: (loadOptions) => {
    let params = '?';
    ['skip', 'take', 'filter'].forEach((option) => {
      if (option in loadOptions && isNotEmpty(loadOptions[option])) {
        params += `${option}=${JSON.stringify(loadOptions[option])}&`;
      }
    });
    params = params.slice(0, -1);
    return fetch(`https://js.devexpress.com/Demos/Mvc/api/DataGridWebApi/CustomersLookup${params}`)
      .then((response) => response.json())
      .then((data) => ({
        data: data.data,
      }))
      .catch(() => {
        throw new Error('Data Loading Error');
      });
  },
});

const renderState = (data) => (
  <span>
    {data.State_Long} ({data.State_Short})
  </span>
);

function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [state, setState] = useState('');
  const [currentClient, setCurrentClient] = useState('');

  const handleFirstNameChange = useCallback((e: AutocompleteTypes.ValueChangedEvent) => {
    setFirstName(e.value);
  }, []);

  const handleLastNameChange = useCallback((e: AutocompleteTypes.ValueChangedEvent) => {
    setLastName(e.value);
  }, []);

  const handleStateChange = useCallback((e: AutocompleteTypes.ValueChangedEvent) => {
    setState(e.value);
  }, []);

  const handleCurrentClientChange = useCallback((e: AutocompleteTypes.ValueChangedEvent) => {
    setCurrentClient(e.value);
  }, []);

  let fullInfo = '';
  fullInfo += `${firstName || ''} ${lastName || ''}`.trim();
  fullInfo += fullInfo && position ? `, ${position}` : position || '';
  fullInfo += fullInfo && state ? `, ${state}` : state || '';
  fullInfo += fullInfo && currentClient ? `, ${currentClient}` : currentClient || '';

  return (
    <div className="form">
      <div className="dx-fieldset">
        <div className="dx-fieldset-header">Default Mode</div>
        <div className="dx-field">
          <div className="dx-field-label">First Name</div>
          <div className="dx-field-value">
            <Autocomplete
              dataSource={names}
              value={firstName}
              onValueChanged={handleFirstNameChange}
              placeholder="Type first name..."
            />
          </div>
        </div>
      </div>

      <div className="dx-fieldset">
        <div className="dx-fieldset-header">With Clear Button</div>
        <div className="dx-field">
          <div className="dx-field-label">Last Name</div>
          <div className="dx-field-value">
            <Autocomplete
              dataSource={surnames}
              value={lastName}
              onValueChanged={handleLastNameChange}
              showClearButton={true}
              placeholder="Type last name..."
            />
          </div>
        </div>
      </div>

      <div className="dx-fieldset">
        <div className="dx-fieldset-header">Disabled</div>
        <div className="dx-field">
          <div className="dx-field-label">Position</div>
          <div className="dx-field-value">
            <Autocomplete
              dataSource={positions}
              value={position}
              disabled={true}
            />
          </div>
        </div>
      </div>

      <div className="dx-fieldset">
        <div className="dx-fieldset-header">Custom Item Template and Data Source Usage</div>
        <div className="dx-field">
          <div className="dx-field-label">State</div>
          <div className="dx-field-value">
            <Autocomplete
              dataSource={states}
              value={state}
              valueExpr="State_Long"
              onValueChanged={handleStateChange}
              placeholder="Type state name..."
              itemRender={renderState}
            />
          </div>
        </div>
      </div>

      <div className="dx-fieldset">
        <div className="dx-fieldset-header">Custom Store and Search Options</div>
        <div className="dx-field">
          <div className="dx-field-label">Current Client</div>
          <div className="dx-field-value">
            <Autocomplete
              dataSource={clientsStore}
              value={currentClient}
              valueExpr="Text"
              onValueChanged={handleCurrentClientChange}
              minSearchLength={2}
              searchTimeout={500}
              placeholder="Type client name..."
            />
          </div>
        </div>
      </div>

      <div className="dx-fieldset">
        <div className="dx-fieldset-header">Event Handling</div>
        <div className="employees-data">
          Employee data: <span>{fullInfo}</span>
        </div>
      </div>
    </div>
  );
}

export default App;
