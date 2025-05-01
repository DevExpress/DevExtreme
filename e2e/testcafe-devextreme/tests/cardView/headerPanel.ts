
test('headerPanel column chooser link opens column chooser on click', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const cardView = new CardView('#container');
  const headerPanel = cardView.getHeaderPanel();

  await t.click(headerPanel.getColumnChooserLink());

  await testScreenshot(t, takeScreenshot, 'card-view-column-chooser-opened-on-empty-header-panel-link-click.png', { element: cardView.element });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxCardView', {
  height: 600,
  columns: [
    { dataField: 'Column 1', visible: false },
  ],
}));
