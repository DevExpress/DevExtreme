import CardView from 'devextreme-testcafe-models/cardView';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';

fixture.disablePageReloads`CardView - Card Header`
  .page(url(__dirname, '../container.html'));

const CARD_VIEW_SELECTOR = '#container';

test('cardHeader item with a named template should render the template content (T1328152)', async (t) => {
  const cardView = new CardView(CARD_VIEW_SELECTOR);

  await t.expect(cardView.isReady()).ok();

  await t.expect(cardView.getCard(0).getToolbarItemContent(0).textContent).eql('custom_content');
}).before(async () => createWidget('dxCardView', {
  dataSource: [
    { id: 1 },
  ],
  keyExpr: 'id',
  cardHeader: {
    visible: true,
    items: [
        { template: 'myTemplate' },
    ],
  },
  templatesRenderAsynchronously: true,
  integrationOptions: {
    templates: {
      myTemplate: {
        render(e) {
          setTimeout(() => {
            $('<div>').text('custom_content').appendTo(e.container);
            e.onRendered?.();
          }, 100);
        },
      },
    },
  },
}));
