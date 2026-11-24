import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/screenshots';

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

test.describe('HtmlEditor - lists', () => {
  test('ordered list numbering sequence should reset for each list item (T1220554)', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', {
      height: 200,
      width: 200,
      value: orderedListMarkup,
    });

    await testScreenshot(page, 'htmleditor-ordered-list-appearance.png', { element: '#container' });
  });

  test('should reset nested ordered list counters when preceded by text (T1320286)', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', {
      height: 200,
      width: 200,
      value: orderedListWithTextMarkup,
    });

    await testScreenshot(page, 'htmleditor-ordered-list-text-appearance.png', { element: '#container' });
  });
});
