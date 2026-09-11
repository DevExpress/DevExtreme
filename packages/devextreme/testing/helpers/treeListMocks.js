import $ from 'jquery';
import treeListCoreModule from '__internal/grids/tree_list/m_core';
import domUtilsModule from '__internal/core/utils/m_dom';
import commonUtilsModule from '__internal/core/utils/m_common';
import typeUtilsModule from '__internal/core/utils/m_type';
import ArrayStoreModule from 'common/data/array_store';
import gridBaseMockModule from './gridBaseMocks.js';

const gridBaseMock = gridBaseMockModule.default ?? gridBaseMockModule;
const treeListCore = treeListCoreModule.default ?? treeListCoreModule;
const domUtils = domUtilsModule.default ?? domUtilsModule;
const commonUtils = commonUtilsModule.default ?? commonUtilsModule;
const typeUtils = typeUtilsModule.default ?? typeUtilsModule;
const ArrayStore = ArrayStoreModule.default ?? ArrayStoreModule;

const treeListMocks = gridBaseMock(
    $,
    treeListCore,
    null,
    domUtils,
    commonUtils,
    typeUtils,
    ArrayStore,
    'TreeList'
);

window.treeListMocks = treeListMocks;

export const setupTreeListModules = treeListMocks.setupTreeListModules;
export const MockDataController = treeListMocks.MockDataController;
export const MockEditingController = treeListMocks.MockEditingController;
export const MockSelectionController = treeListMocks.MockSelectionController;
export const MockColumnsController = treeListMocks.MockColumnsController;
export const MockTablePositionViewController = treeListMocks.MockTablePositionViewController;
export const MockGridDataSource = treeListMocks.MockGridDataSource;
export const getCells = treeListMocks.getCells;
export const MockColumnsSeparatorView = treeListMocks.MockColumnsSeparatorView;
export const MockTrackerView = treeListMocks.MockTrackerView;
export const MockDraggingPanel = treeListMocks.MockDraggingPanel;
export const TestDraggingHeader = treeListMocks.TestDraggingHeader;
export const generateItems = treeListMocks.generateItems;
export const generateNestedData = treeListMocks.generateNestedData;

export default treeListMocks;
