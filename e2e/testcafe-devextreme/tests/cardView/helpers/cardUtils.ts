import CardView from 'devextreme-testcafe-models/cardView';

const getCardFieldCaptions = async (
  t: TestController,
  cardView: CardView,
  expectedCount: number,
  cardIndex = 0,
): Promise<string[]> => {
  const card = cardView.getCard(cardIndex);
  const captions = await card.getCaptions();

  await t.expect(captions.length).eql(expectedCount);

  return captions;
};

export { getCardFieldCaptions };
