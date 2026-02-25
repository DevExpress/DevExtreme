import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/themeUtils';

const orderedListMarkup = `
  <ol>
    <li>Item 1
      <ol>
        <li></li>
        <ol>
          <li></li>
        </ol>
      </ol>
    </li>
    <li>Item 2
      <ol>
        <li></li>
        <ol>
          <li></li>
        </ol>
      </ol>
    </li>
  </ol>
`;

const orderedListWithTextMarkup = `
  <p>Text</p>
  <ol>
    <li>Text
      <ol>
        <li>1</li>
        <li>2</li>
      </ol>
    </li>
    <li>Text
      <ol>
        <li>1</li>
        <li>2</li>
      </ol>
    </li>
  </ol>
`;

fixture`HtmlEditor - lists`
  .page(url(__dirname, '../../container-extended.html'));

test('ordered list numbering sequence should reset for each list item (T1220554)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'htmleditor-ordered-list-appearance.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxHtmlEditor', {
    height: 200,
    width: 200,
    value: orderedListMarkup,
  });
});

test('should reset nested ordered list counters when preceded by text (T1320286)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'htmleditor-ordered-list-text-appearance.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxHtmlEditor', {
    height: 200,
    width: 200,
    value: orderedListWithTextMarkup,
  });
});
