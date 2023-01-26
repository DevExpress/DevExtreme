import url from '../../../helpers/getPageUrl';
import Popup from '../../../model/popup';
import asyncForEach from '../../../helpers/asyncForEach';
import createWidget from '../../../helpers/createWidget';
import { appendElementTo } from '../../../helpers/domUtils';
import { safeSizeTest } from '../../../helpers/safeSizeTest';

fixture.disablePageReloads`Popup`
  .page(url(__dirname, '../../container.html'));

safeSizeTest('Popup can not be dragged outside of the container (window)', async (t) => {
  const popup = new Popup('#container');

  const content = popup.getContent();
  const toolbar = popup.getToolbar();

  const popupRect: { bottom: number; top: number; left: number; right: number } = {
    bottom: 0, top: 0, left: 0, right: 0,
  };

  await t
    .drag(toolbar, -10000, -10000);

  await asyncForEach(['bottom', 'left', 'top', 'right'], async (prop) => {
    popupRect[prop] = await content.getBoundingClientRectProperty(prop);
  });

  await t
    .expect(popupRect.top)
    .eql(0);

  await t
    .expect(popupRect.left)
    .eql(0);

  await t
    .drag(toolbar, 10000, 10000);

  await asyncForEach(['bottom', 'left', 'top', 'right'], async (prop) => {
    popupRect[prop] = await content.getBoundingClientRectProperty(prop);
  });

  await t
    .expect(popupRect.bottom)
    .eql(700);

  await t
    .expect(popupRect.right)
    .eql(700);
}, [700, 700]).before(async () => createWidget('dxPopup', {
  width: 100,
  height: 100,
  visible: true,
  dragEnabled: true,
  animation: undefined,
}));

test('Popup can not be dragged if content bigger than container', async (t) => {
  const popup = new Popup('#popup');

  const content = popup.getContent();
  const toolbar = popup.getToolbar();

  const popupPosition: { top: number; left: number } = {
    top: 0, left: 0,
  };

  const newPopupPosition: { top: number; left: number } = {
    top: 0, left: 0,
  };

  await asyncForEach(['left', 'top'], async (prop) => {
    popupPosition[prop] = await content.getBoundingClientRectProperty(prop);
  });

  await t
    .drag(toolbar, 50, 50);

  await asyncForEach(['left', 'top'], async (prop) => {
    newPopupPosition[prop] = await content.getBoundingClientRectProperty(prop);
  });

  await t
    .expect(popupPosition.top)
    .eql(newPopupPosition.top);

  await t
    .expect(popupPosition.left)
    .eql(newPopupPosition.left);
}).before(async () => {
  await appendElementTo('#container', 'div', 'popup', {});
  await appendElementTo('#container', 'div', 'popupContainer', { width: '99px', height: '99px' });

  return createWidget('dxPopup', {
    position: { of: '#popupContainer' },
    container: '#popupContainer',
    visible: true,
    width: 100,
    height: 100,
    animation: undefined,
  }, '#popup');
});

test('Popup can be dragged outside of the container if dragOutsideBoundary is enabled', async (t) => {
  const popup = new Popup('#container');

  const content = popup.getContent();
  const toolbar = popup.getToolbar();

  const popupPosition: { top: number; left: number } = {
    top: 0, left: 0,
  };

  await t
    .drag(toolbar, -10000, -10000);

  await asyncForEach(['left', 'top'], async (prop) => {
    popupPosition[prop] = await content.getBoundingClientRectProperty(prop);
  });

  await t
    .expect(popupPosition.top)
    .lt(0);

  await t
    .expect(popupPosition.left)
    .lt(0);
}).before(async () => createWidget('dxPopup', {
  width: 100,
  height: 100,
  visible: true,
  dragEnabled: true,
  dragOutsideBoundary: true,
  animation: undefined,
}));
