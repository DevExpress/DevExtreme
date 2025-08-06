import * as testingLib from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import * as React from 'react';

import { useState, useEffect } from 'react';
import SelectBox from '../../../select-box';
import TextBox from '../../../text-box';
import {
  Form,
  RequiredRule,
  SimpleItem,
} from '../../../form';
import Validator from '../../../validator';
import ValidationSummary from '../../../validation-summary';
import { ContextMenu, Item as ContextMenuItem } from '../../../context-menu';
import Button from '../../../button';

jest.useFakeTimers();

describe('integration tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
    testingLib.cleanup();
  });

  it('renders selectbox with nested Validator component without double error rendering', async () => {
    const user = userEvent.setup({ delay: null });
    const groupName = "sharedGroup";
    const onClick = (e: any) => {
      return e.validationGroup?.validate();
    };

    const items = [
      {
        id: 1,
        description: "One",
      },
    ];

    const SelectBoxWithValidator = () => {
      const [formData, setFormData] = React.useState({ code: null, type: null });

      const valueChanged = React.useCallback((e) => {
        setFormData((prevFormData) => {
          return {
            ...prevFormData,
            type: e.value,
          };
        });
      }, []);

      return (
        <>
          <Form validationGroup={groupName} formData={formData}>
            <SimpleItem>
              <SelectBox
                value={formData.type}
                onValueChanged={valueChanged}
                items={items}
                showClearButton
                valueExpr={'id'}
                displayExpr={'description'}
              >
                <Validator validationGroup={groupName}>
                  <RequiredRule message='Type is required' />
                </Validator>
              </SelectBox>
            </SimpleItem>
          </Form>
          <ValidationSummary validationGroup={groupName} />
          <Button validationGroup={groupName} text='Validate' onClick={onClick} />
        </>
      );
    }

    testingLib.render(
      <React.Fragment>
        <SelectBoxWithValidator />
      </React.Fragment>
    );

    await user.click(testingLib.screen.getByText('Validate'));
    const summaryElement = document.querySelector('.dx-validationsummary');
    expect(summaryElement?.children.length).toBe(1);
  })

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

  it('context menu renders items specified as config components', async () => {
    const user = userEvent.setup({ delay: null });

    const renderContextMenu = testingLib.render(
      <React.StrictMode>
        <div className='my-context-menu-target'>Right-click me!</div>
        <ContextMenu target='.my-context-menu-target'>
          <ContextMenuItem text='Category 1'>
            <ContextMenuItem>
              <div>Item 1</div>
            </ContextMenuItem>
            <ContextMenuItem>
              <div>Item 2</div>
            </ContextMenuItem>
            <ContextMenuItem>
              <div>Item 3</div>
            </ContextMenuItem>
          </ContextMenuItem>
        </ContextMenu>
      </React.StrictMode>
    );

    await user.pointer({ target: testingLib.screen.getByText('Right-click me!'), keys: '[MouseRight]' });

    const categoryMenuItemElement = await renderContextMenu.findByText('Category 1');
    expect(categoryMenuItemElement).not.toBeFalsy();

    await user.hover(testingLib.screen.getByText('Category 1'));
    const firstMenuSubItemElement = await renderContextMenu.findByText('Item 1');

    expect(firstMenuSubItemElement).not.toBeFalsy();
  });
});