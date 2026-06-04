import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';

fixture.disablePageReloads`CardView - Editing`
  .page(url(__dirname, '../../container.html'));

const CARD_VIEW_SELECTOR = '#container';

const config = {
  columns: [
    { dataField: 'id', caption: 'ID' },
    { dataField: 'title', caption: 'Task Title' },
    { dataField: 'status', caption: 'Status' },
  ],
  dataSource: [],
  keyExpr: 'id',
  editing: {
    allowAdding: true,
    form: {
      items: ['id', 'title', 'status'],
    },
  },
  onInitNewCard(e) {
    e.data.id = 10;
    e.data.status = 'Not Started';
    e.data.title = 'New Task';
  },
};

test('should show default values in popup fields after onInitNewCard', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);
  await t
    .expect(cardView.isReady())
    .ok();

  await t.click(cardView.getToolbar().getAddButton().element);
  await t
    .expect(cardView.isReady())
    .ok();

  const popup = cardView.getEditingPopup();

  const idInput = popup.find('input[name="id"]');
  const titleInput = popup.find('input[name="title"]');
  const statusInput = popup.find('input[name="status"]');

  await t.expect(idInput.value).eql('10');
  await t.expect(titleInput.value).eql('New Task');
  await t.expect(statusInput.value).eql('Not Started');
}).before(async () => createWidget('dxCardView', config));
