import CardView from 'devextreme-testcafe-models/cardView';

const FIELD_CAPTION_SELECTOR = '.dx-cardview-field-caption';

const getCardFieldCaptions = async (
  t: TestController,
  cardView: CardView,
  expectedCount: number,
  cardIndex = 0,
): Promise<string[]> => {
  const card = cardView.getCard(cardIndex);
  const captionElements = card.element.find(FIELD_CAPTION_SELECTOR);

  await t.expect(captionElements.count).eql(expectedCount);

  const captions: string[] = [];

  for (let i = 0; i < expectedCount; i += 1) {
    const caption = await captionElements.nth(i).innerText;
    captions.push(caption.replace(/:$/, ''));
  }

  return captions;
};

export { getCardFieldCaptions };
