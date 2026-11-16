import CardView from 'devextreme/ui/card_view';
import ContextMenu from 'devextreme/ui/context_menu';
import DataGrid from 'devextreme/ui/data_grid';
import PivotGrid from 'devextreme/ui/pivot_grid';
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

new CardView(document.createElement('div'), {
  onContextMenuPreparing(e) {
    contextMenu.option('position', {
      of: e.event?.type === 'keydown' ? e.targetElement : e.event,
    });
  },
});

new PivotGrid(document.createElement('div'), {
  onContextMenuPreparing(e) {
    contextMenu.option('position', {
      of: e.event?.type === 'keydown' ? e.event.target : e.event,
    });
  },
});
