import { ClientFunction, Selector } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo } from '../../../helpers/domUtils';

const OVERLAY_CONTENT_CLASS = 'dx-overlay-content';
const FA_MAIN_BUTTON_CLASS = 'dx-fa-button-main';
const FAB_OFFSET = 16;

const getViewportClientSize = ClientFunction(() => ({
  width: document.documentElement.clientWidth,
  height: document.documentElement.clientHeight,
}));

fixture`FloatingAction - visible area`
  .page(url(__dirname, '../../container.html'));

test('FAB should keep its offset from the visible area edges after scrollbars appear (T1334663)', async (t) => {
  const fabContent = Selector(`.${FA_MAIN_BUTTON_CLASS} .${OVERLAY_CONTENT_CLASS}`);
  const initialSize = await getViewportClientSize();

  await t
    .expect(fabContent.getBoundingClientRectProperty('right'))
    .within(initialSize.width - FAB_OFFSET - 1, initialSize.width - FAB_OFFSET + 1)
    .expect(fabContent.getBoundingClientRectProperty('bottom'))
    .within(initialSize.height - FAB_OFFSET - 1, initialSize.height - FAB_OFFSET + 1);

  await appendElementTo('#container', 'div', 'tall-content', { width: '3000px', height: '3000px' });

  const sizeWithScrollbars = await getViewportClientSize();

  await t
    .expect(fabContent.getBoundingClientRectProperty('right'))
    .within(sizeWithScrollbars.width - FAB_OFFSET - 1, sizeWithScrollbars.width - FAB_OFFSET + 1)
    .expect(fabContent.getBoundingClientRectProperty('bottom'))
    .within(sizeWithScrollbars.height - FAB_OFFSET - 1, sizeWithScrollbars.height - FAB_OFFSET + 1);
}).before(async () => createWidget('dxSpeedDialAction', {
  icon: 'add',
  visible: true,
}));
