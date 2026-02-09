import {
  afterEach, beforeEach, describe, expect, it,
} from '@jest/globals';
import { formatMessage, loadMessages, locale } from '@js/localization';

import { HeaderFilterModel } from '../../../grid_core/__tests__/__mock__/model/header_filter';
import {
  afterTest,
  beforeTest,
  createCardView,
  flushAsync,
} from './__mock__/helpers/utils';

const testLocale = 'xx';
const testMessages = {
  [testLocale]: {
    'dxDataGrid-columnChooserTitle': 'xx - Column Chooser',
    'dxDataGrid-filterPanelCreateFilter': 'xx - Create Filter',
    'dxDataGrid-filterPanelClearFilter': 'xx - Clear',
    'dxDataGrid-filterPanelFilterEnabledHint': 'xx - Enable the filter',
    'dxFilterBuilder-and': 'xx - And',
    'dxFilterBuilder-or': 'xx - Or',
    'dxFilterBuilder-notAnd': 'xx - Not And',
    'dxFilterBuilder-notOr': 'xx - Not Or',
    'dxFilterBuilder-filterOperationBetween': 'xx - Between',
    'dxFilterBuilder-filterOperationEquals': 'xx - Equals',
    'dxFilterBuilder-filterOperationNotEquals': 'xx - Not Equals',
    'dxFilterBuilder-filterOperationLess': 'xx - Less',
    'dxFilterBuilder-filterOperationLessOrEquals': 'xx - Less Or Equals',
    'dxFilterBuilder-filterOperationGreater': 'xx - Greater',
    'dxFilterBuilder-filterOperationGreaterOrEquals': 'xx - Greater Or Equals',
    'dxFilterBuilder-filterOperationStartsWith': 'xx - Starts With',
    'dxFilterBuilder-filterOperationContains': 'xx - Contains',
    'dxFilterBuilder-filterOperationNotContains': 'xx - Not Contains',
    'dxFilterBuilder-filterOperationEndsWith': 'xx - Ends With',
    'dxFilterBuilder-filterOperationIsBlank': 'xx - Is Blank',
    'dxFilterBuilder-filterOperationIsNotBlank': 'xx - Is Not Blank',
    'dxPagination-ariaLabel': 'xx - Page navigation',
    'dxDataGrid-sortingAscendingText': 'xx - Sort Ascending',
    'dxDataGrid-sortingDescendingText': 'xx - Sort Descending',
    'dxDataGrid-sortingClearText': 'xx - Clear Sorting',
    'dxDataGrid-editingConfirmDeleteMessage': 'xx - Are you sure you want to delete this record?',
    'dxDataGrid-editingDeleteRow': 'xx - Delete',
    'dxDataGrid-editingEditRow': 'xx - Edit',
    'dxDataGrid-editingSaveRowChanges': 'xx - Save',
    'dxDataGrid-editingAddRow': 'xx - Add a row',
    'dxDataGrid-editingCancelRowChanges': 'xx - Cancel',
    'dxDataGrid-trueText': 'xx - True',
    'dxDataGrid-falseText': 'xx - False',
    'dxDataGrid-noDataText': 'xx - No data',
    'dxDataGrid-headerFilterEmptyValue': 'xx - (Blanks)',
    'dxDataGrid-headerFilterOK': 'xx - OK',
    'dxDataGrid-headerFilterCancel': 'xx - Cancel',
    'dxDataGrid-searchPanelPlaceholder': 'xx - Search',
  },
};

describe('CardView', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('Localization', () => {
    afterEach(() => {
      locale('en');
    });

    it('should use formatMessage for column captions', async () => {
      const dictionary = {
        en: {
          Company: 'Company',
          Address: 'Address',
        },
        xx: {
          Company: 'xx - Company',
          Address: 'xx - Address',
        },
      };

      loadMessages(dictionary);
      locale('xx');

      const { instance } = await createCardView({
        dataSource: [
          { id: 1, company: 'Test Company', address: 'Test Address' },
        ],
        columns: [
          {
            dataField: 'company',
            caption: formatMessage('Company'),
          },
          {
            dataField: 'address',
            caption: formatMessage('Address'),
          },
        ],
      });

      const columns = instance.option('columns') as { caption?: string }[];

      expect(columns[0].caption).toBe('xx - Company');
      expect(columns[1].caption).toBe('xx - Address');
    });

    it('should change column captions when locale changes', async () => {
      const dictionary = {
        en: {
          Company: 'Company',
        },
        de: {
          Company: 'Firma',
        },
        xx: {
          Company: 'xx - Company',
        },
      };

      loadMessages(dictionary);

      const { instance, component } = await createCardView({
        dataSource: [
          { id: 1, company: 'Test Company' },
        ],
        columns: [
          {
            dataField: 'company',
            caption: formatMessage('Company'),
          },
        ],
      });

      let columns = instance.option('columns') as { caption?: string }[];
      expect(columns[0].caption).toBe('Company');

      locale('de');
      component.apiOption('columns', [
        {
          dataField: 'company',
          caption: formatMessage('Company'),
        },
      ]);

      columns = instance.option('columns') as { caption?: string }[];
      expect(columns[0].caption).toBe('Firma');

      locale('xx');
      component.apiOption('columns', [
        {
          dataField: 'company',
          caption: formatMessage('Company'),
        },
      ]);

      columns = instance.option('columns') as { caption?: string }[];
      expect(columns[0].caption).toBe('xx - Company');
    });

    it('should localize columnChooser title', async () => {
      loadMessages(testMessages);
      locale(testLocale);

      const { instance, component } = await createCardView({
        dataSource: [
          { id: 1, name: 'Test' },
        ],
        columns: ['id', 'name'],
        columnChooser: {
          enabled: true,
          mode: 'select',
        },
      });

      instance.showColumnChooser();

      await flushAsync();

      const columnChooser = component.getColumnChooser();

      expect(columnChooser.isVisible()).toBe(true);
      expect(columnChooser.getTitle()).toBe('xx - Column Chooser');
    });

    it('should localize FilterPanel create filter button', async () => {
      loadMessages(testMessages);
      locale(testLocale);

      const { component } = await createCardView({
        dataSource: [
          { id: 1, name: 'Test' },
        ],
        columns: ['id', 'name'],
        filterPanel: {
          visible: true,
        },
      });

      await flushAsync();

      const filterPanel = component.getFilterPanel();

      expect(filterPanel.isVisible()).toBe(true);
      expect(filterPanel.getCreateFilterButton().textContent).toBe('xx - Create Filter');
    });

    it('should localize FilterPanel clear filter button', async () => {
      loadMessages(testMessages);
      locale(testLocale);

      const { instance, component } = await createCardView({
        dataSource: [
          { id: 1, name: 'Test' },
        ],
        columns: ['id', 'name'],
        filterPanel: {
          visible: true,
        },
      });

      instance.option('filterValue', ['id', '=', 1]);

      await flushAsync();

      const filterPanel = component.getFilterPanel();

      expect(filterPanel.isVisible()).toBe(true);
      expect(filterPanel.getClearFilterButton().textContent).toBe('xx - Clear');
    });

    it('should localize FilterPanel checkbox hint', async () => {
      loadMessages(testMessages);
      locale(testLocale);

      const { component } = await createCardView({
        dataSource: [
          { id: 1, name: 'Test' },
        ],
        columns: ['id', 'name'],
        filterPanel: {
          visible: true,
        },
        filterValue: ['id', '=', 1],
      });

      await flushAsync();

      const filterPanel = component.getFilterPanel();
      const checkbox = filterPanel.getEnableFilterCheckbox();

      expect(filterPanel.isVisible()).toBe(true);
      expect(checkbox.getInstance().$element().attr('title')).toBe('xx - Enable the filter');
    });

    it('should localize FilterBuilder groupOperationDescriptions', async () => {
      loadMessages(testMessages);
      locale(testLocale);

      const { component } = await createCardView({
        dataSource: [
          { id: 1, name: 'Test' },
        ],
        columns: ['id', 'name'],
        filterPanel: {
          visible: true,
        },
      });

      await flushAsync();

      const filterPanel = component.getFilterPanel();
      const createFilterButton = filterPanel.getCreateFilterButton();
      createFilterButton.click();

      await flushAsync();

      const filterBuilder = component.getFilterBuilder();

      expect(filterBuilder.isVisible()).toBe(true);
      expect(filterBuilder.getGroupOperationButton().textContent?.trim()).toBe('xx - And');

      filterBuilder.getGroupOperationButton().click();

      await flushAsync();

      const treeView = filterBuilder.getTreeView();

      expect(treeView.getNodeByText('xx - And')).not.toBeNull();
      expect(treeView.getNodeByText('xx - Or')).not.toBeNull();
      expect(treeView.getNodeByText('xx - Not And')).not.toBeNull();
      expect(treeView.getNodeByText('xx - Not Or')).not.toBeNull();
    });

    it('should localize FilterBuilder filterOperationDescriptions for string fields', async () => {
      loadMessages(testMessages);
      locale(testLocale);

      const { component } = await createCardView({
        dataSource: [
          { id: 1, name: 'Test', age: 25 },
        ],
        columns: ['id', 'name', 'age'],
        filterPanel: {
          visible: true,
        },
        filterValue: ['name', 'contains', ''],
      });

      await flushAsync();

      const filterPanel = component.getFilterPanel();
      const createFilterButton = filterPanel.getCreateFilterButton();
      createFilterButton.click();

      await flushAsync();

      const filterBuilder = component.getFilterBuilder();

      expect(filterBuilder.isVisible()).toBe(true);

      const operationButton = filterBuilder.getOperationButton();
      operationButton.click();

      await flushAsync();

      const operationTreeView = filterBuilder.getTreeView();

      expect(operationTreeView.getNodeByText('xx - Equals')).not.toBeNull();
      expect(operationTreeView.getNodeByText('xx - Not Equals')).not.toBeNull();
      expect(operationTreeView.getNodeByText('xx - Contains')).not.toBeNull();
      expect(operationTreeView.getNodeByText('xx - Not Contains')).not.toBeNull();
      expect(operationTreeView.getNodeByText('xx - Starts With')).not.toBeNull();
      expect(operationTreeView.getNodeByText('xx - Ends With')).not.toBeNull();
      expect(operationTreeView.getNodeByText('xx - Is Blank')).not.toBeNull();
      expect(operationTreeView.getNodeByText('xx - Is Not Blank')).not.toBeNull();
    });

    it('should localize FilterBuilder filterOperationDescriptions for number fields', async () => {
      loadMessages(testMessages);
      locale(testLocale);

      const { component } = await createCardView({
        dataSource: [
          { id: 1, name: 'Test', age: 25 },
        ],
        columns: ['id', 'name', 'age'],
        filterPanel: {
          visible: true,
        },
        filterValue: ['age', '=', 25],
      });

      await flushAsync();

      const filterPanel = component.getFilterPanel();
      const createFilterButton = filterPanel.getCreateFilterButton();
      createFilterButton.click();

      await flushAsync();

      const filterBuilder = component.getFilterBuilder();

      expect(filterBuilder.isVisible()).toBe(true);

      const operationButton = filterBuilder.getOperationButton();
      operationButton.click();

      await flushAsync();

      const operationTreeView = filterBuilder.getTreeView();

      expect(operationTreeView.getNodeByText('xx - Equals')).not.toBeNull();
      expect(operationTreeView.getNodeByText('xx - Not Equals')).not.toBeNull();
      expect(operationTreeView.getNodeByText('xx - Less')).not.toBeNull();
      expect(operationTreeView.getNodeByText('xx - Less Or Equals')).not.toBeNull();
      expect(operationTreeView.getNodeByText('xx - Greater')).not.toBeNull();
      expect(operationTreeView.getNodeByText('xx - Greater Or Equals')).not.toBeNull();
      expect(operationTreeView.getNodeByText('xx - Between')).not.toBeNull();
      expect(operationTreeView.getNodeByText('xx - Is Blank')).not.toBeNull();
      expect(operationTreeView.getNodeByText('xx - Is Not Blank')).not.toBeNull();
    });

    it('should localize Pager aria-label', async () => {
      loadMessages(testMessages);
      locale(testLocale);

      const { component } = await createCardView({
        dataSource: Array.from({ length: 50 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` })),
        columns: ['id', 'name'],
      });

      await flushAsync();

      const pager = component.getPager();
      const pagerElement = pager.getElement();

      expect(pagerElement).not.toBeNull();
      expect(pagerElement?.getAttribute('aria-label')).toBe('xx - Page navigation');
    });

    it('should localize sorting context menu items', async () => {
      loadMessages(testMessages);
      locale(testLocale);

      let menuItems: { text?: string }[] = [];

      const { component } = await createCardView({
        dataSource: [
          { id: 1, name: 'Test 1' },
          { id: 2, name: 'Test 2' },
        ],
        columns: ['id', 'name'],
        headerPanel: {
          visible: true,
        },
        onContextMenuPreparing: (e) => {
          menuItems = e.items ?? [];
        },
      });

      await flushAsync();

      const headerPanel = component.getHeaderPanel();
      const headerItem = headerPanel.getHeaderItemByIndex(0);

      const mouseEvent = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      headerItem.getElement().dispatchEvent(mouseEvent);

      expect(menuItems).toHaveLength(3);
      expect(menuItems[0].text).toBe('xx - Sort Ascending');
      expect(menuItems[1].text).toBe('xx - Sort Descending');
      expect(menuItems[2].text).toBe('xx - Clear Sorting');
    });

    it('should localize boolean column trueText and falseText', async () => {
      loadMessages(testMessages);
      locale(testLocale);

      const { component } = await createCardView({
        dataSource: [
          { id: 1, name: 'Test 1', active: true },
          { id: 2, name: 'Test 2', active: false },
        ],
        columns: [
          'id',
          'name',
          { dataField: 'active', dataType: 'boolean' },
        ],
      });

      await flushAsync();

      const firstCard = component.getCard(0);
      const secondCard = component.getCard(1);

      expect(firstCard.getFieldValue(2)).toBe('xx - True');
      expect(secondCard.getFieldValue(2)).toBe('xx - False');
    });

    it('should localize noDataText', async () => {
      loadMessages(testMessages);
      locale(testLocale);

      const { component } = await createCardView({
        dataSource: [],
        columns: ['id', 'name'],
      });

      await flushAsync();

      const noDataElement = component.getNoDataElement();

      expect(noDataElement).not.toBeNull();
      expect(noDataElement?.textContent?.trim()).toBe('xx - No data');
    });

    it('should localize header filter texts', async () => {
      loadMessages(testMessages);
      locale(testLocale);

      const { component } = await createCardView({
        dataSource: [
          { id: 1, name: 'Test 1' },
          { id: 2, name: 'Test 2' },
          { id: 3, name: null },
        ],
        columns: [
          'id',
          'name',
        ],
        headerFilter: {
          visible: true,
        },
      });

      await flushAsync();

      const headerPanel = component.getHeaderPanel();
      headerPanel.getHeaderItemByIndex(1).getIcon().click();

      await flushAsync();

      const headerFilter = new HeaderFilterModel();

      expect(headerFilter.isVisible()).toBe(true);

      expect(headerFilter.getOKButton().textContent).toBe('xx - OK');
      expect(headerFilter.getCancelButton().textContent).toBe('xx - Cancel');
      expect(headerFilter.getListItem(0).textContent).toBe('xx - (Blanks)');
    });

    it('should localize searchPanel placeholder', async () => {
      loadMessages(testMessages);
      locale(testLocale);

      const { component } = await createCardView({
        dataSource: [
          { id: 1, name: 'Test 1' },
          { id: 2, name: 'Test 2' },
        ],
        columns: ['id', 'name'],
        searchPanel: {
          visible: true,
        },
      });

      await flushAsync();

      const searchEditor = component.getSearchEditor();
      const input = searchEditor.getInput();
      expect(input.placeholder).toBe('xx - Search');
    });

    describe('Editing texts', () => {
      it('should localize confirmDeleteMessage', async () => {
        loadMessages(testMessages);
        locale(testLocale);

        const { instance, component } = await createCardView({
          dataSource: [
            { id: 1, name: 'Test 1' },
            { id: 2, name: 'Test 2' },
          ],
          columns: ['id', 'name'],
          keyExpr: 'id',
          editing: {
            allowAdding: true,
            allowDeleting: true,
            allowUpdating: true,
          },
        });

        await flushAsync();

        instance.deleteCard(0);

        await flushAsync();

        const dialog = component.getConfirmationDialog();
        expect(dialog.isVisible()).toBe(true);
        expect(dialog.getMessage()).toBe('xx - Are you sure you want to delete this record?');

        const cancelButton = dialog.getCancelButton();
        cancelButton?.click();

        await flushAsync();
      });

      it('should localize saveCard and cancel', async () => {
        loadMessages(testMessages);
        locale(testLocale);

        const { instance, component } = await createCardView({
          dataSource: [
            { id: 1, name: 'Test 1' },
            { id: 2, name: 'Test 2' },
          ],
          columns: ['id', 'name'],
          keyExpr: 'id',
          editing: {
            allowAdding: true,
            allowDeleting: true,
            allowUpdating: true,
          },
        });

        await flushAsync();

        instance.editCard(0);

        await flushAsync();

        const editForm = component.getEditForm();
        expect(editForm.isVisible()).toBe(true);

        const saveButton = editForm.getSaveButton();
        expect(saveButton).not.toBeNull();
        expect(saveButton?.textContent?.trim()).toBe('xx - Save');

        const cancelButton = editForm.getCancelButton();
        expect(cancelButton).not.toBeNull();
        expect(cancelButton?.textContent?.trim()).toBe('xx - Cancel');
      });
    });
  });
});
