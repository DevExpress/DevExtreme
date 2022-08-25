/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type ApplyFilterMode = 'auto' | 'onClick';

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type ApplyChangesMode = 'instantly' | 'onDemand';

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type ColumnChooserMode = 'dragAndDrop' | 'select';

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type DataChangeType = 'insert' | 'update' | 'remove';

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type DataRenderMode = 'standard' | 'virtual';

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type EnterKeyAction = 'startEdit' | 'moveFocus';

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type EnterKeyDirection = 'none' | 'column' | 'row';

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type FilterOperation = '=' | '<>' | '<' | '<=' | '>' | '>=' | 'contains' | 'endswith' | 'isblank' | 'isnotblank' | 'notcontains' | 'startswith' | 'between' | 'anyof' | 'noneof';

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type FilterType = 'exclude' | 'include';

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type GridsEditMode = 'batch' | 'cell' | 'row' | 'form' | 'popup';

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type GridsEditRefreshMode = 'full' | 'reshape' | 'repaint';

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type GroupExpandMode = 'buttonClick' | 'rowClick';

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type NewRowPosition = 'first' | 'last' | 'pageBottom' | 'pageTop' | 'viewportBottom' | 'viewportTop';

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type PagerDisplayMode = 'adaptive' | 'compact' | 'full';

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type PagerPageSize = 'all' | 'auto';

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type SelectedFilterOperation = '<' | '<=' | '<>' | '=' | '>' | '>=' | 'between' | 'contains' | 'endswith' | 'notcontains' | 'startswith';

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type SelectionColumnDisplayMode = 'always' | 'none' | 'onClick' | 'onLongTap';

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type StartEditAction = 'click' | 'dblClick';

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type StateStoreType = 'custom' | 'localStorage' | 'sessionStorage';

/**
 * @public
 * @namespace DevExpress.common.grids
 */
export type SummaryType = 'avg' | 'count' | 'custom' | 'max' | 'min' | 'sum';
