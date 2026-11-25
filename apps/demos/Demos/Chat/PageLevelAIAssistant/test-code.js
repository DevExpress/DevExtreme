testUtils.importAnd(() => 'devextreme/ui/speed_dial_action/repaint_floating_action_button', () => DevExpress.ui.repaintFloatingActionButton, (repaintFloatingActionButton) => testUtils
  .postponeUntilFound('#grid-container .dx-data-row')
  .then(() => testUtils.postponeUntilFound('.dx-fa-button-icon'))
  .then(() => {
    // The button is placed by #grid-container once, and the grid grows when it renders its rows.
    repaintFloatingActionButton();
  }));
