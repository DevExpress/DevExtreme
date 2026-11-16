// NOTE: Order of imports important here and shouldn't be changed.
/* eslint-disable simple-import-sort/imports */
import TreeList from './widget_base';

import './state_storing';
import './module_not_extended/ai_column';
import './module_not_extended/column_chooser';
import './master_detail';
import './editing/editing';
import './module_not_extended/editing_row_based';
import './module_not_extended/editing_form_based';
import './module_not_extended/editing_cell_based';
import './validating';
import './virtual_scrolling';
import './module_not_extended/filter_row';
import './module_not_extended/header_filter';
import './module_not_extended/filter_sync';
import './module_not_extended/filter_builder';
import './module_not_extended/filter_panel';
import './module_not_extended/pager';
import './module_not_extended/columns_resizing_reordering';
import './module_not_extended/sticky_columns';
import './module_not_extended/column_fixing';
import './module_not_extended/adaptivity';
import './selection/selection';
import './module_not_extended/search';
import './keyboard_navigation';
import './module_not_extended/headers_keyboard_navigation';
import './module_not_extended/virtual_columns';
import './focus';
import './module_not_extended/row_dragging';
import './module_not_extended/toast';
import './ai_assistant/ai_assistant';

export default TreeList;
