import * as testingLib from '@testing-library/react';
import * as React from 'react';

import { useState, useEffect } from 'react';
import SelectBox from '../../../select-box';
import TextBox from '../../../text-box';

jest.useFakeTimers();

describe('selectbox', () => {
  afterEach(() => {
    jest.clearAllMocks();
    testingLib.cleanup();
  });

  it('renders selectbox in strict mode when data source is specified dynamically without errors', () => {
    const Field = (data: any) => {
      return (<TextBox defaultValue={data && data.Name} />);
    }
    
    const list = [{ ID: 1, Name: 'Item 1' }];
    
    const SelectBoxWithDynamicDataSource = () => {
      const [items, setItems] = useState([{}]);
      
      useEffect(() => {
        setItems(list);
      }, []);
      
      return (
        <SelectBox
          dataSource={items}
          displayExpr="Name"
          valueExpr="ID"
          fieldRender={Field}
        />
      );
    };

    const renderSelectBox = () => testingLib.render(
      <React.StrictMode>
        <SelectBoxWithDynamicDataSource />
      </React.StrictMode>
    );

    expect(renderSelectBox).not.toThrow();
  });
});