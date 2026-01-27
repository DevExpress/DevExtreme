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
import DataGrid from '../../../data-grid';
import Scheduler, { View, Resource } from '../../../scheduler';
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
    const summaryElement = document.getElementsByClassName('dx-validationsummary-item');
    expect(summaryElement?.length).toBe(1);
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

  it('ref callback is not triggered when not needed', async () => {
    const user = userEvent.setup({ delay: null });
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {}); 

    const DataGridWithSelectButton = () => {
    const [selectedRowKeys, setSelectedRowKeys] = React.useState([] as any);

    const refCallback = React.useCallback((instance) => {
      console.warn(`Ref callback invoked instance=${instance}`);
    }, []);

    const click = React.useCallback(
      () => {
        setSelectedRowKeys([...selectedRowKeys, selectedRowKeys.length + 1]);
      },
      [selectedRowKeys]
    );

    const employees = [
      {
        ID: 1,
        FirstName: 'John',
        LastName: 'Heart',
        Prefix: 'Mr.',
        Position: 'CEO',
        BirthDate: '1964/03/16',
        HireDate: '1995/01/15',
        Notes: 'John has been in the Audio/Video industry since 1990. He has led DevAv as its CEO since 2003.\r\n\r\nWhen not working hard as the CEO, John loves to golf and bowl. He once bowled a perfect game of 300.',
        Address: '351 S Hill St.',
        StateID: 5,
      }, {
        ID: 2,
        FirstName: 'Olivia',
        LastName: 'Peyton',
        Prefix: 'Mrs.',
        Position: 'Sales Assistant',
        BirthDate: '1981/06/03',
        HireDate: '2012/05/14',
        Notes: 'Olivia loves to sell. She has been selling DevAV products since 2012. \r\n\r\nOlivia was homecoming queen in high school. She is expecting her first child in 6 months. Good Luck Olivia.',
        Address: '807 W Paseo Del Mar',
        StateID: 5,
      }
    ];

    return (
      <React.Fragment>
        <button onClick={click}>Test</button>
        <DataGrid
          id="gridContainer"
          ref={refCallback}
          dataSource={employees}
          keyExpr="ID"
          allowColumnReordering={true}
          showBorders={true}
          selectedRowKeys={selectedRowKeys}
        ></DataGrid>
      </React.Fragment>
    )
    }

    testingLib.render(
       <React.Fragment>
        <DataGridWithSelectButton />
      </React.Fragment>
    );

    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    await user.click(testingLib.screen.getByText('Test'));
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    await user.click(testingLib.screen.getByText('Test'));
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    consoleWarnSpy.mockRestore();
  });

  it('must not fail if a template with two root elements is unmounted (T1300588)', async () => {
    try {
      jest.useRealTimers();
      expect.assertions(1);

      const user = userEvent.setup({ delay: null });

      const currentDate = new Date(2021, 3, 27);
      const dayOfWeekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const typeGroups = ['typeId'];
      const priorityGroups = ['priorityId'];

      const data = [
        {
          text: 'Walking a dog',
          priorityId: 1,
          typeId: 1,
          startDate: new Date('2021-04-26T15:00:00.000Z'),
          endDate: new Date('2021-04-26T15:30:00.000Z'),
          recurrenceRule: 'FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR;UNTIL=20210502',
        },
        {
          text: 'Website Re-Design Plan',
          priorityId: 2,
          typeId: 2,
          startDate: new Date('2021-04-26T16:00:00.000Z'),
          endDate: new Date('2021-04-26T18:30:00.000Z'),
        },
        {
          text: 'Book Flights to San Fran for Sales Trip',
          priorityId: 2,
          typeId: 2,
          startDate: new Date('2021-04-26T19:00:00.000Z'),
          endDate: new Date('2021-04-26T20:00:00.000Z'),
        }
      ];

      const priorityData = [{
        text: 'Low Priority',
        id: 1,
        color: '#fcb65e',
      }, {
        text: 'High Priority',
        id: 2,
        color: '#e18e92',
      }];

      const typeData = [{
        text: 'Home',
        id: 1,
        color: '#b6d623',
      }, {
        text: 'Work',
        id: 2,
        color: '#679ec5',
      }];

      const DateCell = ({ data: cellData }) => (
        <React.Fragment>
          <div className="name">{dayOfWeekNames[cellData.date.getDay()]}</div>
          <div className="number">{cellData.date.getDate()}</div>
        </React.Fragment>
      );

      let clicked = false;
      let resolve = () => {};

      const onContentReady = async () => {
        if (clicked)
          return;

        clicked = true;
        await expect(user.click(document.querySelector('.dx-icon-chevronnext')!)).resolves.toBe(void 0);
        resolve();
      }

      const SchedulerWithTemplates = () => (
        <Scheduler
          timeZone="America/Los_Angeles"
          dataSource={data}
          defaultCurrentView="workWeek"
          showAllDayPanel={false}
          defaultCurrentDate={currentDate}
          height={730}
          startDayHour={7}
          endDayHour={23}
          onContentReady={onContentReady}
        >
          <View type="day" />
          <View type="week" groups={typeGroups} dateCellComponent={DateCell} />
          <View
            type="workWeek"
            groups={priorityGroups}
            startDayHour={9}
            endDayHour={18}
            dateCellComponent={DateCell}
          />
          <View type="month" />
          <Resource
            dataSource={priorityData}
            fieldExpr="priorityId"
            label="Priority"
            allowMultiple={false}
          />
          <Resource
            dataSource={typeData}
            fieldExpr="typeId"
            label="Type"
            allowMultiple={false}
          />
        </Scheduler>
      );
      
      testingLib.render(
        <React.Fragment>
          <SchedulerWithTemplates />
        </React.Fragment>
      );

      await testingLib.act(async () => {
        return new Promise((r) => {
          resolve = r;
        });
      });
    }
    finally {
      jest.useFakeTimers();
    }
  });
});