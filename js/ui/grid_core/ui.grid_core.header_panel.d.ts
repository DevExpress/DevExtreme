import { ToolbarItem, Toolbar as GridToolbar } from '../data_grid';
import Toolbar, { Properties as ToolbarProperties } from '../toolbar';
import { dxElementWrapper } from '../../core/renderer';
import { ColumnsView } from './ui.grid_core.columns_view';

interface State {
  _toolbar: Toolbar;
  _toolbarOptions: ToolbarProperties;
}

interface HeaderPanel extends ColumnsView, State {
  _getToolbarItems: (this: this) => ToolbarItem[];

  _getButtonContainer: (this: this) => dxElementWrapper;

  _getToolbarButtonClass: (this: this, specificClass: string) => string;

  _getToolbarOptions: (this: this) => ToolbarProperties;

  _normalizeToolbarItems: (this: this, defaultItems: ToolbarItem[], userItems: GridToolbar['items']) => ToolbarItem[];

  _columnOptionChanged: any;

  setToolbarItemDisabled: (this: this, name: string, optionValue: boolean) => any;

  updateToolbarDimensions: (this: this) => void;

  getHeaderPanel: (this: this) => dxElementWrapper;

  getHeight: (this: this) => number;

  isVisible: (this: this) => boolean;

  allowDragging: any;

  _appendColumnChooserItem: (this: this, items: ToolbarItem[]) => ToolbarItem[];

  getSearchTextEditor: (this: this, ...args: any[]) => any;
}
