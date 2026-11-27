import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('VectorMap', 'DynamicViewport', { width: 900, height: 900 }, () => {
  test('VectorMap.DynamicViewport', async ({ page }) => {
    const zoomButton = page.locator('#vector-map .dxm-control-bar g').nth(1);
    const showSelectBoxItems = () => page.locator('.options .dx-dropdowneditor-input-wrapper input.dx-texteditor-input').first().click();
    const selectItem = (index: number) => page.locator('.dx-dropdowneditor-overlay .dx-list-item-content').nth(index);

    // TestCafe moved the mouse to the point and acted on whatever was on top there (here the transparent trackers over the SVG), so the actionability check is skipped.
    await zoomButton.click({ position: { x: 10, y: 10 }, force: true });
    await zoomButton.click({ position: { x: 10, y: 10 }, force: true });
    await testScreenshot(page, 'zoom_vector_map_by_control_bar.png');

    await showSelectBoxItems();
    await selectItem(4).click();
    await testScreenshot(page, 'vector_map_viewport-changing.png');
  });
});
