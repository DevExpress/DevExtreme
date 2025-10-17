import CardView from 'devextreme-testcafe-models/cardView';
import { ClientFunction } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { remoteApiIdGroupMock, remoteApiMock, remoteData } from '../helpers/remoteApiMock';

fixture.disablePageReloads`HeaderFilter.RemoteDataSource.Functional`
  .page(url(__dirname, '../../container.html'));

const CARD_VIEW_SELECTOR = '#container';

const setRemoteOperations = (remoteOperations) => ClientFunction(() => {
  (window as any).testRemoteOperations = remoteOperations;
}, { dependencies: { remoteOperations } })();

const clearRemoteOperations = () => ClientFunction(() => {
  delete (window as any).testRemoteOperations;
})();

[
  { remoteOperations: 'auto' },
  { remoteOperations: true },
  { remoteOperations: false },
].forEach(({ remoteOperations }) => {
  test(`remote operations: ${remoteOperations} -> list should contain loaded items`, async (t) => {
    const cardView = new CardView(CARD_VIEW_SELECTOR);

    const filterIcon = cardView
      .getHeaderPanel()
      .getHeaderItem()
      .getFilterIcon();
    await t.click(filterIcon);

    const list = cardView.getHeaderFilterList();
    const itemCount = await list.getItems().count;

    await t.expect(itemCount).eql(remoteData.length);

    for (let idx = 0; idx < remoteData.length; idx += 1) {
      await t.expect(list.getItem(idx).text).eql(remoteData[idx].A);
    }

    await t.click(cardView.element);
  }).before(async (t) => {
    await t.addRequestHooks(remoteApiMock);
    await setRemoteOperations(remoteOperations);
    await createWidget('dxCardView', () => ({
      dataSource: {
        store: (window as any).DevExpress.data.AspNet.createStore({
          key: 'id',
          loadUrl: 'https://api/data',
        }),
      },
      columns: ['A', 'B', 'C'],
      remoteOperations: (window as any).testRemoteOperations,
      headerFilter: {
        visible: true,
      },
      height: 600,
    }));
  }).after(async (t) => {
    await t.removeRequestHooks(remoteApiMock);
    await clearRemoteOperations();
  });

  test(`remote operations: ${remoteOperations} -> should support custom dataSource`, async (t) => {
    const cardView = new CardView(CARD_VIEW_SELECTOR);

    const filterIcon = cardView
      .getHeaderPanel()
      .getHeaderItem()
      .getFilterIcon();
    await t.click(filterIcon);

    const list = cardView.getHeaderFilterList();
    const itemCount = await list.getItems().count;

    await t.expect(itemCount).eql(3);

    for (let idx = 0; idx < 3; idx += 1) {
      await t.expect(list.getItem(idx).text).eql(`CUSTOM_${idx}`);
    }

    await t.click(cardView.element);
  }).before(async (t) => {
    await t.addRequestHooks(remoteApiMock);
    await setRemoteOperations(remoteOperations);
    await createWidget('dxCardView', () => ({
      dataSource: {
        store: (window as any).DevExpress.data.AspNet.createStore({
          key: 'id',
          loadUrl: 'https://api/data',
        }),
      },
      columns: [
        {
          dataField: 'A',
          headerFilter: {
            dataSource: [
              { text: 'CUSTOM_0', value: 0 },
              { text: 'CUSTOM_1', value: 1 },
              { text: 'CUSTOM_2', value: 2 },
            ],
          },
        },
        'B',
        'C',
      ],
      remoteOperations: (window as any).testRemoteOperations,
      headerFilter: {
        visible: true,
      },
      height: 600,
    }));
  }).after(async (t) => {
    await t.removeRequestHooks(remoteApiMock);
    await clearRemoteOperations();
  });

  test(`remote operations: ${remoteOperations} -> should update column options with filterType and values (regular selection)`, async (t) => {
    const cardView = new CardView(CARD_VIEW_SELECTOR);

    const filterIcon = cardView
      .getHeaderPanel()
      .getHeaderItem()
      .getFilterIcon();
    await t.click(filterIcon);

    const popup = cardView.getHeaderFilterPopup();
    const list = cardView.getHeaderFilterList();

    const okBtn = popup.getButton(0);
    const firstItem = list.getItem(0);
    const secondItem = list.getItem(1);

    await t.click(firstItem.element)
      .click(secondItem.element)
      .click(okBtn.element);

    const columnOptions = await cardView.getColumnOption('A');

    await t
      .expect(columnOptions.filterType).eql(undefined)
      .expect(columnOptions.filterValues).eql(['A_0', 'A_1']);

    await t.click(cardView.element);
  }).before(async (t) => {
    await t.addRequestHooks(remoteApiMock);
    await setRemoteOperations(remoteOperations);
    await createWidget('dxCardView', () => ({
      dataSource: {
        store: (window as any).DevExpress.data.AspNet.createStore({
          key: 'id',
          loadUrl: 'https://api/data',
        }),
      },
      columns: ['A', 'B', 'C'],
      remoteOperations: (window as any).testRemoteOperations,
      headerFilter: {
        visible: true,
      },
      height: 600,
    }));
  }).after(async (t) => {
    await t.removeRequestHooks(remoteApiMock);
    await clearRemoteOperations();
  });

  test(`remote operations: ${remoteOperations} -> should update column options with filterType and values (selectAll case #0)`, async (t) => {
    const cardView = new CardView(CARD_VIEW_SELECTOR);

    const filterIcon = cardView
      .getHeaderPanel()
      .getHeaderItem()
      .getFilterIcon();
    await t.click(filterIcon);

    const popup = cardView.getHeaderFilterPopup();
    const list = cardView.getHeaderFilterList();

    const okBtn = popup.getButton(0);
    const selectAllCheckbox = list.selectAll.element;

    await t.click(selectAllCheckbox)
      .click(okBtn.element);

    const columnOptions = await cardView.getColumnOption('A');

    await t
      .expect(columnOptions.filterType).eql('exclude')
      .expect(columnOptions.filterValues).eql(null);

    await t.click(cardView.element);
  }).before(async (t) => {
    await t.addRequestHooks(remoteApiMock);
    await setRemoteOperations(remoteOperations);
    await createWidget('dxCardView', () => ({
      dataSource: {
        store: (window as any).DevExpress.data.AspNet.createStore({
          key: 'id',
          loadUrl: 'https://api/data',
        }),
      },
      columns: ['A', 'B', 'C'],
      remoteOperations: (window as any).testRemoteOperations,
      headerFilter: {
        visible: true,
      },
      height: 600,
    }));
  }).after(async (t) => {
    await t.removeRequestHooks(remoteApiMock);
    await clearRemoteOperations();
  });

  test(`remote operations: ${remoteOperations} -> should update column options with filterType and values (selectAll case #1)`, async (t) => {
    const cardView = new CardView(CARD_VIEW_SELECTOR);

    const filterIcon = cardView
      .getHeaderPanel()
      .getHeaderItem()
      .getFilterIcon();
    await t.click(filterIcon);

    const popup = cardView.getHeaderFilterPopup();
    const list = cardView.getHeaderFilterList();

    const okBtn = popup.getButton(0);
    const selectAllCheckbox = list.selectAll.element;
    const firstItem = list.getItem(2);
    const secondItem = list.getItem(3);

    await t.click(selectAllCheckbox)
      .click(firstItem.element)
      .click(secondItem.element)
      .click(okBtn.element);

    const columnOptions = await cardView.getColumnOption('A');

    await t
      .expect(columnOptions.filterType).eql('exclude')
      .expect(columnOptions.filterValues).eql(['A_2', 'A_3']);

    await t.click(cardView.element);
  }).before(async (t) => {
    await t.addRequestHooks(remoteApiMock);
    await setRemoteOperations(remoteOperations);
    await createWidget('dxCardView', () => ({
      dataSource: {
        store: (window as any).DevExpress.data.AspNet.createStore({
          key: 'id',
          loadUrl: 'https://api/data',
        }),
      },
      columns: ['A', 'B', 'C'],
      remoteOperations: (window as any).testRemoteOperations,
      headerFilter: {
        visible: true,
      },
      height: 600,
    }));
  }).after(async (t) => {
    await t.removeRequestHooks(remoteApiMock);
    await clearRemoteOperations();
  });

  test(`remote operations: ${remoteOperations} -> should apply filter from options (type: "include" by default)`, async (t) => {
    const cardView = new CardView(CARD_VIEW_SELECTOR);

    const filterIcon = cardView
      .getHeaderPanel()
      .getHeaderItem()
      .getFilterIcon();
    await t.click(filterIcon);

    const list = cardView.getHeaderFilterList();

    const firstItem = list.getItem(0);
    const secondItem = list.getItem(1);
    const thirdItem = list.getItem(2);

    await t
      .expect(firstItem.checkBox.isChecked).ok()
      .expect(secondItem.checkBox.isChecked).ok()
      .expect(thirdItem.checkBox.isChecked)
      .notOk();

    await t.click(cardView.element);
  }).before(async (t) => {
    await t.addRequestHooks(remoteApiMock);
    await setRemoteOperations(remoteOperations);
    await createWidget('dxCardView', () => ({
      dataSource: {
        store: (window as any).DevExpress.data.AspNet.createStore({
          key: 'id',
          loadUrl: 'https://api/data',
        }),
      },
      columns: [
        {
          dataField: 'A',
          filterValues: ['A_0', 'A_1'],
        },
        'B',
        'C',
      ],
      remoteOperations: (window as any).testRemoteOperations,
      headerFilter: {
        visible: true,
      },
      height: 600,
    }));
  }).after(async (t) => {
    await t.removeRequestHooks(remoteApiMock);
    await clearRemoteOperations();
  });

  test(`remote operations: ${remoteOperations} -> should apply filter from options (type: "include")`, async (t) => {
    const cardView = new CardView(CARD_VIEW_SELECTOR);

    const filterIcon = cardView
      .getHeaderPanel()
      .getHeaderItem()
      .getFilterIcon();
    await t.click(filterIcon);

    const list = cardView.getHeaderFilterList();

    const firstItem = list.getItem(0);
    const secondItem = list.getItem(1);
    const thirdItem = list.getItem(2);

    await t
      .expect(firstItem.checkBox.isChecked).ok()
      .expect(secondItem.checkBox.isChecked).ok()
      .expect(thirdItem.checkBox.isChecked)
      .notOk();

    await t.click(cardView.element);
  }).before(async (t) => {
    await t.addRequestHooks(remoteApiMock);
    await setRemoteOperations(remoteOperations);
    await createWidget('dxCardView', () => ({
      dataSource: {
        store: (window as any).DevExpress.data.AspNet.createStore({
          key: 'id',
          loadUrl: 'https://api/data',
        }),
      },
      columns: [
        {
          dataField: 'A',
          filterValues: ['A_0', 'A_1'],
          filterType: 'include',
        },
        'B',
        'C',
      ],
      remoteOperations: (window as any).testRemoteOperations,
      headerFilter: {
        visible: true,
      },
      height: 600,
    }));
  }).after(async (t) => {
    await t.removeRequestHooks(remoteApiMock);
    await clearRemoteOperations();
  });

  test(`remote operations: ${remoteOperations} -> should apply filter from options (type: "exclude")`, async (t) => {
    const cardView = new CardView(CARD_VIEW_SELECTOR);

    await t.expect(cardView.getHeaderFilterPopup().element.visible).notOk();

    const filterIcon = cardView
      .getHeaderPanel()
      .getHeaderItem()
      .getFilterIcon();
    await t.click(filterIcon);

    const list = cardView.getHeaderFilterList();

    const firstItem = list.getItem(0);
    const secondItem = list.getItem(1);
    const thirdItem = list.getItem(2);

    await t
      .expect(firstItem.checkBox.isChecked).ok()
      .expect(secondItem.checkBox.isChecked).ok()
      .expect(thirdItem.checkBox.isChecked)
      .notOk();

    await t.click(cardView.element);
  }).before(async (t) => {
    await t.addRequestHooks(remoteApiMock);
    await setRemoteOperations(remoteOperations);
    await createWidget('dxCardView', () => ({
      dataSource: {
        store: (window as any).DevExpress.data.AspNet.createStore({
          key: 'id',
          loadUrl: 'https://api/data',
        }),
      },
      columns: [
        {
          dataField: 'A',
          filterValues: ['A_2', 'A_3', 'A_4'],
          filterType: 'exclude',
        },
        'B',
        'C',
      ],
      remoteOperations: (window as any).testRemoteOperations,
      headerFilter: {
        visible: true,
      },
      height: 600,
    }));
  }).after(async (t) => {
    await t.removeRequestHooks(remoteApiMock);
    await clearRemoteOperations();
  });

  test(`remote operations: ${remoteOperations} -> should process groupInterval option`, async (t) => {
    const cardView = new CardView(CARD_VIEW_SELECTOR);
    const expectedTexts = [
      '0 - 5',
      '5 - 10',
    ];

    const filterIcon = cardView
      .getHeaderPanel()
      .getHeaderItem()
      .getFilterIcon();
    await t.click(filterIcon);

    const list = cardView.getHeaderFilterList();
    const itemCount = await list.getItems().count;

    await t.expect(itemCount).eql(expectedTexts.length);

    for (let idx = 0; idx < expectedTexts.length; idx += 1) {
      await t.expect(list.getItem(idx).text).eql(expectedTexts[idx]);
    }

    await t.click(cardView.element);
  }).before(async (t) => {
    await t.addRequestHooks(remoteApiIdGroupMock);
    await setRemoteOperations(remoteOperations);
    await createWidget('dxCardView', () => ({
      dataSource: {
        store: (window as any).DevExpress.data.AspNet.createStore({
          key: 'id',
          loadUrl: 'https://api/data',
        }),
      },
      columns: [
        {
          dataField: 'id',
          dataType: 'number',
          headerFilter: {
            groupInterval: 5,
          },
        },
        'A',
      ],
      remoteOperations: (window as any).testRemoteOperations,
      headerFilter: {
        visible: true,
      },
      height: 600,
    }));
  }).after(async (t) => {
    await t.removeRequestHooks(remoteApiIdGroupMock);
    await clearRemoteOperations();
  });

  test(`remote operations: ${remoteOperations} -> should not update column options if popup cancel btn clicked`, async (t) => {
    const cardView = new CardView(CARD_VIEW_SELECTOR);

    const filterIcon = cardView
      .getHeaderPanel()
      .getHeaderItem()
      .getFilterIcon();
    await t.click(filterIcon);

    const popup = cardView.getHeaderFilterPopup();
    const list = cardView.getHeaderFilterList();

    const cancelBtn = popup.getButton(1);
    const firstItem = list.getItem(0);
    const secondItem = list.getItem(1);

    await t
      .click(firstItem.element)
      .click(secondItem.element)
      .click(cancelBtn.element);

    const columnOptions = await cardView.getColumnOption('A');

    await t
      .expect(columnOptions.filterType).eql(undefined)
      .expect(columnOptions.filterValues).eql(['A_4']);

    await t.click(cardView.element);
  }).before(async (t) => {
    await t.addRequestHooks(remoteApiMock);
    await setRemoteOperations(remoteOperations);
    await createWidget('dxCardView', () => ({
      dataSource: {
        store: (window as any).DevExpress.data.AspNet.createStore({
          key: 'id',
          loadUrl: 'https://api/data',
        }),
      },
      columns: [
        {
          dataField: 'A',
          filterValues: ['A_4'],
        },
        'B',
        'C',
      ],
      remoteOperations: (window as any).testRemoteOperations,
      headerFilter: {
        visible: true,
      },
      height: 600,
    }));
  }).after(async (t) => {
    await t.removeRequestHooks(remoteApiMock);
    await clearRemoteOperations();
  });
});
