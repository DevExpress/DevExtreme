import {
  afterEach, beforeEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';
import DataGrid from '@js/ui/data_grid';
import { AIIntegration } from '@ts/core/ai_integration/core/ai_integration';

const GRID_CONTAINER_ID = 'gridContainer';

interface RequestResult {
  promise: Promise<string>;
  abort: () => void;
}

const dataSource = [{
  ID: 1,
  FirstName: 'John',
  LastName: 'Heart',
  Position: 'CEO',
  BirthDate: new Date('1964/03/16'),
  HireDate: new Date('1995/01/15'),
  City: 'Los Angeles',
  State: 'CA',
  Email: 'john.heart@example.com',
  Phone: '555-0100',
}, {
  ID: 2,
  FirstName: 'Olivia',
  LastName: 'Peyton',
  Position: 'Sales Assistant',
  BirthDate: new Date('1981/06/03'),
  HireDate: new Date('2012/05/14'),
  City: 'San Diego',
  State: 'CA',
  Email: 'olivia.peyton@example.com',
  Phone: '555-0200',
}];

const flushAsync = async (): Promise<void> => {
  jest.runOnlyPendingTimers();
  await Promise.resolve();
};

const getEditorValue = (editForm: any, dataField: string): any => {
  const $formElement = editForm.$element();
  const itemID = editForm.getItemID(dataField);
  const escapedID = itemID.replace(/([.:!])/g, '\\$1');
  const $input = $formElement.find(`#${escapedID}`);
  if ($input.length) {
    const $widget = $input.closest('.dx-widget');
    if ($widget.length) {
      const widgetNames = $widget.data('dxComponents');
      if (widgetNames && widgetNames.length > 0) {
        const widget = $widget.data(widgetNames[0]);
        return widget?.option('value');
      }
    }
  }
  return undefined;
};

describe('DataGrid - Form-based editing with Smart Paste', () => {
  let $gridContainer;
  let gridInstance: DataGrid;

  beforeEach(() => {
    jest.useFakeTimers();
    $gridContainer = $('<div>')
      .attr('id', GRID_CONTAINER_ID)
      .appendTo(document.body);

    Object.defineProperty(navigator, 'clipboard', {
      value: {
        readText: jest.fn<() => Promise<string>>().mockResolvedValue('Jane Doe, CTO, San Francisco, jane.doe@example.com, 555-9999'),
      } as Partial<Clipboard>,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    gridInstance?.dispose();
    $gridContainer.remove();
    jest.useRealTimers();
  });

  it('should update editors when Smart Paste is triggered', async () => {
    const mockAIResultString = 'FirstName:::Jane;;;LastName:::Doe;;;Position:::CTO;;;City:::San Francisco;;;Email:::jane.doe@example.com;;;Phone:::555-9999';

    gridInstance = new DataGrid($gridContainer.get(0) as HTMLDivElement, {
      dataSource: [...dataSource],
      keyExpr: 'ID',
      editing: {
        mode: 'form',
        allowUpdating: true,
        form: {
          aiIntegration: new AIIntegration({
            sendRequest(): RequestResult {
              return {
                promise: Promise.resolve(mockAIResultString),
                abort: (): void => {},
              };
            },
          }),
        },
      },
      columns: ['FirstName', 'LastName', 'Position', 'City', 'Email', 'Phone'],
    });

    await flushAsync();

    gridInstance.editRow(0);
    await flushAsync();

    const editForm = (gridInstance as any).getController('editing')._editForm;
    expect(editForm).toBeDefined();

    const formAIIntegration = editForm.option('aiIntegration');
    expect(formAIIntegration).toBeDefined();

    const $formElement = editForm.$element();
    const $buttonsContainer = $formElement.parent().find('.dx-datagrid-form-buttons-container');
    const $allButtons = $buttonsContainer.find('.dx-button');

    const $smartPasteButton = $allButtons.filter((_, el) => {
      const $el = $(el);
      const buttonInstance = ($el as any).dxButton('instance');
      return buttonInstance?.option('text') === 'Smart Paste';
    }).first();

    expect($smartPasteButton.length).toBe(1);

    const dataController = (gridInstance as any).getController('data');
    const fireErrorSpy = jest.spyOn(dataController, 'fireError');

    ($smartPasteButton.get(0) as HTMLElement)?.click();

    await flushAsync();

    expect(fireErrorSpy).not.toHaveBeenCalledWith('E1043');
    fireErrorSpy.mockRestore();

    expect(getEditorValue(editForm, 'FirstName')).toBe('Jane');
    expect(getEditorValue(editForm, 'LastName')).toBe('Doe');
    expect(getEditorValue(editForm, 'Position')).toBe('CTO');
    expect(getEditorValue(editForm, 'City')).toBe('San Francisco');
    expect(getEditorValue(editForm, 'Email')).toBe('jane.doe@example.com');
    expect(getEditorValue(editForm, 'Phone')).toBe('555-9999');

    const editingController = (gridInstance as any).getController('editing');
    const changes = editingController.getChanges();
    expect(changes.length).toBe(1);
    expect(changes[0].data.FirstName).toBe('Jane');
    expect(changes[0].data.LastName).toBe('Doe');
    expect(changes[0].data.Position).toBe('CTO');

    expect(changes[0].key).toBe(1);
    expect(changes[0].type).toBe('update');

    const $saveButton = $allButtons.filter((_, el) => {
      const $el = $(el);
      const buttonInstance = ($el as any).dxButton('instance');
      return buttonInstance?.option('text') === 'Save';
    }).first();

    expect($saveButton.length).toBe(1);
    ($saveButton.get(0) as HTMLElement)?.click();

    await flushAsync();

    const $gridElement = $gridContainer;
    const $firstNameCell = $gridElement.find('.dx-data-row').first().find('td').eq(0);
    const $lastNameCell = $gridElement.find('.dx-data-row').first().find('td').eq(1);
    const $positionCell = $gridElement.find('.dx-data-row').first().find('td').eq(2);

    expect($firstNameCell.text()).toBe('Jane');
    expect($lastNameCell.text()).toBe('Doe');
    expect($positionCell.text()).toBe('CTO');
  });

  it('should not save changes when Cancel button is clicked after Smart Paste', async () => {
    const mockAIResultString = 'FirstName:::Alice;;;LastName:::Brown;;;Position:::Manager;;;City:::New York;;;Email:::alice.brown@example.com;;;Phone:::555-3333';

    gridInstance = new DataGrid($gridContainer.get(0) as HTMLDivElement, {
      dataSource: [...dataSource],
      keyExpr: 'ID',
      editing: {
        mode: 'form',
        allowUpdating: true,
        form: {
          aiIntegration: new AIIntegration({
            sendRequest(): RequestResult {
              return {
                promise: Promise.resolve(mockAIResultString),
                abort: (): void => {},
              };
            },
          }),
        },
      },
      columns: ['FirstName', 'LastName', 'Position', 'City', 'Email', 'Phone'],
    });

    await flushAsync();

    gridInstance.editRow(1);
    await flushAsync();

    const editForm = (gridInstance as any).getController('editing')._editForm;
    expect(editForm).toBeDefined();

    const $formElement = editForm.$element();
    const $buttonsContainer = $formElement.parent().find('.dx-datagrid-form-buttons-container');
    const $allButtons = $buttonsContainer.find('.dx-button');

    const $smartPasteButton = $allButtons.filter((_, el) => {
      const $el = $(el);
      const buttonInstance = ($el as any).dxButton('instance');
      return buttonInstance?.option('text') === 'Smart Paste';
    }).first();

    expect($smartPasteButton.length).toBe(1);

    ($smartPasteButton.get(0) as HTMLElement)?.click();

    await flushAsync();

    expect(getEditorValue(editForm, 'FirstName')).toBe('Alice');
    expect(getEditorValue(editForm, 'LastName')).toBe('Brown');

    const $cancelButton = $allButtons.filter((_, el) => {
      const $el = $(el);
      const buttonInstance = ($el as any).dxButton('instance');
      return buttonInstance?.option('text') === 'Cancel';
    }).first();

    expect($cancelButton.length).toBe(1);
    ($cancelButton.get(0) as HTMLElement)?.click();

    await flushAsync();

    const editingController = (gridInstance as any).getController('editing');
    const changes = editingController.getChanges();
    expect(changes.length).toBe(0);

    const $gridElement = $gridContainer;
    const $secondRow = $gridElement.find('.dx-data-row').eq(1);
    const $firstNameCell = $secondRow.find('td').eq(0);
    const $lastNameCell = $secondRow.find('td').eq(1);
    const $positionCell = $secondRow.find('td').eq(2);

    expect($firstNameCell.text()).toBe('Olivia');
    expect($lastNameCell.text()).toBe('Peyton');
    expect($positionCell.text()).toBe('Sales Assistant');
  });

  it('should update editors when Smart Paste is triggered in popup mode', async () => {
    const mockAIResultString = 'FirstName:::Jane;;;LastName:::Doe;;;Position:::CTO;;;City:::San Francisco;;;Email:::jane.doe@example.com;;;Phone:::555-9999';

    gridInstance = new DataGrid($gridContainer.get(0) as HTMLDivElement, {
      dataSource: [...dataSource],
      keyExpr: 'ID',
      editing: {
        mode: 'popup',
        allowUpdating: true,
        form: {
          aiIntegration: new AIIntegration({
            sendRequest(): RequestResult {
              return {
                promise: Promise.resolve(mockAIResultString),
                abort: (): void => {},
              };
            },
          }),
        },
      },
      columns: ['FirstName', 'LastName', 'Position', 'City', 'Email', 'Phone'],
    });

    await flushAsync();

    gridInstance.editRow(0);
    await flushAsync();

    const editForm = (gridInstance as any).getController('editing')._editForm;
    expect(editForm).toBeDefined();

    const formAIIntegration = editForm.option('aiIntegration');
    expect(formAIIntegration).toBeDefined();

    const editingController = (gridInstance as any).getController('editing');
    const $popupContent = $(editingController.getPopupContent());
    expect($popupContent.length).toBeGreaterThan(0);

    const $overlayContent = $popupContent.closest('.dx-overlay-content');
    const $allButtons = $overlayContent.find('.dx-button');
    // @ts-expect-error jQuery filter accepts function but types are incorrect
    const $smartPasteButton = $allButtons.filter((_, el) => {
      const $el = $(el);
      const buttonInstance = ($el as any).dxButton('instance');
      return buttonInstance?.option('text') === 'Smart Paste';
    }).first();

    expect($smartPasteButton.length).toBe(1);

    const dataController = (gridInstance as any).getController('data');
    const fireErrorSpy = jest.spyOn(dataController, 'fireError');

    ($smartPasteButton.get(0) as HTMLElement)?.click();

    await flushAsync();

    expect(fireErrorSpy).not.toHaveBeenCalledWith('E1043');
    fireErrorSpy.mockRestore();

    expect(getEditorValue(editForm, 'FirstName')).toBe('Jane');
    expect(getEditorValue(editForm, 'LastName')).toBe('Doe');
    expect(getEditorValue(editForm, 'Position')).toBe('CTO');
    expect(getEditorValue(editForm, 'City')).toBe('San Francisco');
    expect(getEditorValue(editForm, 'Email')).toBe('jane.doe@example.com');
    expect(getEditorValue(editForm, 'Phone')).toBe('555-9999');

    const changes = editingController.getChanges();
    expect(changes.length).toBe(1);
    expect(changes[0].data.FirstName).toBe('Jane');
    expect(changes[0].data.LastName).toBe('Doe');
    expect(changes[0].data.Position).toBe('CTO');

    expect(changes[0].key).toBe(1);
    expect(changes[0].type).toBe('update');
  });

  it('should save changes when Save button is clicked after Smart Paste in popup mode', async () => {
    const mockAIResultString = 'FirstName:::Alice;;;LastName:::Smith;;;Position:::Manager;;;City:::New York;;;Email:::alice.smith@example.com;;;Phone:::555-7777';

    gridInstance = new DataGrid($gridContainer.get(0) as HTMLDivElement, {
      dataSource: [...dataSource],
      keyExpr: 'ID',
      editing: {
        mode: 'popup',
        allowUpdating: true,
        form: {
          aiIntegration: new AIIntegration({
            sendRequest(): RequestResult {
              return {
                promise: Promise.resolve(mockAIResultString),
                abort: (): void => {},
              };
            },
          }),
        },
      },
      columns: ['FirstName', 'LastName', 'Position', 'City', 'Email', 'Phone'],
    });

    await flushAsync();

    gridInstance.editRow(0);
    await flushAsync();

    const editForm = (gridInstance as any).getController('editing')._editForm;
    expect(editForm).toBeDefined();

    const editingController = (gridInstance as any).getController('editing');
    const $popupContent = $(editingController.getPopupContent());
    expect($popupContent.length).toBeGreaterThan(0);

    const $overlayContent = $popupContent.closest('.dx-overlay-content');
    const $allButtons = $overlayContent.find('.dx-button');
    // @ts-expect-error jQuery filter accepts function but types are incorrect
    const $smartPasteButton = $allButtons.filter((_, el) => {
      const $el = $(el);
      const buttonInstance = ($el as any).dxButton('instance');
      return buttonInstance?.option('text') === 'Smart Paste';
    }).first();

    expect($smartPasteButton.length).toBe(1);

    ($smartPasteButton.get(0) as HTMLElement)?.click();

    await flushAsync();

    expect(getEditorValue(editForm, 'FirstName')).toBe('Alice');
    expect(getEditorValue(editForm, 'LastName')).toBe('Smith');
    expect(getEditorValue(editForm, 'Position')).toBe('Manager');

    // @ts-expect-error jQuery filter accepts function but types are incorrect
    const $saveButton = $allButtons.filter((_, el) => {
      const $el = $(el);
      const buttonInstance = ($el as any).dxButton('instance');
      return buttonInstance?.option('text') === 'Save';
    }).first();

    expect($saveButton.length).toBe(1);
    ($saveButton.get(0) as HTMLElement)?.click();

    await flushAsync();

    const $gridElement = $gridContainer;
    const $firstNameCell = $gridElement.find('.dx-data-row').first().find('td').eq(0);
    const $lastNameCell = $gridElement.find('.dx-data-row').first().find('td').eq(1);
    const $positionCell = $gridElement.find('.dx-data-row').first().find('td').eq(2);

    expect($firstNameCell.text()).toBe('Alice');
    expect($lastNameCell.text()).toBe('Smith');
    expect($positionCell.text()).toBe('Manager');
  });

  it('should not save changes when Cancel button is clicked after Smart Paste in popup mode', async () => {
    const mockAIResultString = 'FirstName:::Bob;;;LastName:::Johnson;;;Position:::Developer;;;City:::Seattle;;;Email:::bob.johnson@example.com;;;Phone:::555-8888';

    gridInstance = new DataGrid($gridContainer.get(0) as HTMLDivElement, {
      dataSource: [...dataSource],
      keyExpr: 'ID',
      editing: {
        mode: 'popup',
        allowUpdating: true,
        form: {
          aiIntegration: new AIIntegration({
            sendRequest(): RequestResult {
              return {
                promise: Promise.resolve(mockAIResultString),
                abort: (): void => {},
              };
            },
          }),
        },
      },
      columns: ['FirstName', 'LastName', 'Position', 'City', 'Email', 'Phone'],
    });

    await flushAsync();

    gridInstance.editRow(1);
    await flushAsync();

    const editForm = (gridInstance as any).getController('editing')._editForm;
    expect(editForm).toBeDefined();

    const editingController = (gridInstance as any).getController('editing');
    const $popupContent = $(editingController.getPopupContent());
    expect($popupContent.length).toBeGreaterThan(0);

    const $overlayContent = $popupContent.closest('.dx-overlay-content');
    const $allButtons = $overlayContent.find('.dx-button');
    // @ts-expect-error jQuery filter accepts function but types are incorrect
    const $smartPasteButton = $allButtons.filter((_, el) => {
      const $el = $(el);
      const buttonInstance = ($el as any).dxButton('instance');
      return buttonInstance?.option('text') === 'Smart Paste';
    }).first();

    expect($smartPasteButton.length).toBe(1);

    ($smartPasteButton.get(0) as HTMLElement)?.click();

    await flushAsync();

    expect(getEditorValue(editForm, 'FirstName')).toBe('Bob');
    expect(getEditorValue(editForm, 'LastName')).toBe('Johnson');

    // @ts-expect-error jQuery filter accepts function but types are incorrect
    const $cancelButton = $allButtons.filter((_, el) => {
      const $el = $(el);
      const buttonInstance = ($el as any).dxButton('instance');
      return buttonInstance?.option('text') === 'Cancel';
    }).first();

    expect($cancelButton.length).toBe(1);
    ($cancelButton.get(0) as HTMLElement)?.click();

    await flushAsync();

    const changes = editingController.getChanges();
    expect(changes.length).toBe(0);

    const $gridElement = $gridContainer;
    const $secondRow = $gridElement.find('.dx-data-row').eq(1);
    const $firstNameCell = $secondRow.find('td').eq(0);
    const $lastNameCell = $secondRow.find('td').eq(1);
    const $positionCell = $secondRow.find('td').eq(2);

    expect($firstNameCell.text()).toBe('Olivia');
    expect($lastNameCell.text()).toBe('Peyton');
    expect($positionCell.text()).toBe('Sales Assistant');
  });
});
