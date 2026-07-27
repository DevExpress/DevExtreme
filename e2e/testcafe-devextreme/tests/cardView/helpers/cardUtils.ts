import CardView from 'devextreme-testcafe-models/cardView';

const FIELD_CAPTION_SELECTOR = '.dx-cardview-field-caption';

export const getCardFieldCaptions = async (
  t: TestController,
  cardView: CardView,
  expectedCount: number,
  cardIndex = 0,
): Promise<string[]> => {
  const card = cardView.getCard(cardIndex);

  await t
    .expect(card.element.find(FIELD_CAPTION_SELECTOR).count)
    .eql(expectedCount);

  const captions = await card.getCaptions();

  return captions;
};
