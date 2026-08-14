import $ from 'jquery';
import gridCoreModule from '__internal/grids/data_grid/m_core';
import columnResizingReorderingModule from '__internal/grids/data_grid/module_not_extended/columns_resizing_reordering';
import domUtilsModule from '__internal/core/utils/m_dom';
import commonUtilsModule from '__internal/core/utils/m_common';
import typeUtilsModule from '__internal/core/utils/m_type';
import ArrayStoreModule from 'common/data/array_store';
import gridBaseMockModule from './gridBaseMocks.js';

const gridBaseMock = gridBaseMockModule.default ?? gridBaseMockModule;
const gridCore = gridCoreModule.default ?? gridCoreModule;
const columnResizingReordering = columnResizingReorderingModule.default ?? columnResizingReorderingModule;
const domUtils = domUtilsModule.default ?? domUtilsModule;
const commonUtils = commonUtilsModule.default ?? commonUtilsModule;
const typeUtils = typeUtilsModule.default ?? typeUtilsModule;
const ArrayStore = ArrayStoreModule.default ?? ArrayStoreModule;

const dataGridMocks = gridBaseMock(
    $,
    gridCore,
    columnResizingReordering,
    domUtils,
    commonUtils,
    typeUtils,
    ArrayStore,
    'DataGrid'
);

window.dataGridMocks = dataGridMocks;

export const setupDataGridModules = dataGridMocks.setupDataGridModules;
export const MockDataController = dataGridMocks.MockDataController;
export const MockEditingController = dataGridMocks.MockEditingController;
export const MockSelectionController = dataGridMocks.MockSelectionController;
export const MockColumnsController = dataGridMocks.MockColumnsController;
export const MockTablePositionViewController = dataGridMocks.MockTablePositionViewController;
export const MockGridDataSource = dataGridMocks.MockGridDataSource;
export const getCells = dataGridMocks.getCells;
export const MockColumnsSeparatorView = dataGridMocks.MockColumnsSeparatorView;
export const MockTrackerView = dataGridMocks.MockTrackerView;
export const MockDraggingPanel = dataGridMocks.MockDraggingPanel;
export const TestDraggingHeader = dataGridMocks.TestDraggingHeader;
export const generateItems = dataGridMocks.generateItems;
export const generateNestedData = dataGridMocks.generateNestedData;

export default dataGridMocks;
