import ContextMenu from 'devextreme/ui/context_menu';
import DataGrid from 'devextreme/ui/data_grid';
import TreeList from 'devextreme/ui/tree_list';

const contextMenu = new ContextMenu(document.createElement('div'), {});

new DataGrid(document.createElement('div'), {
  onContextMenuPreparing(e) {
    contextMenu.option('position', { of: e.event });
  },
});

new TreeList(document.createElement('div'), {
  onContextMenuPreparing(e) {
    contextMenu.option('position', { of: e.event });
  },
});
