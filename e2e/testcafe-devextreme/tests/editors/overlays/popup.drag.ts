import { ClientFunction, Selector } from 'testcafe';
import Popup from 'devextreme-testcafe-models/popup';
import url from '../../../helpers/getPageUrl';
import asyncForEach from '../../../helpers/asyncForEach';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo } from '../../../helpers/domUtils';

fixture.disablePageReloads`Popup`
  .page(url(__dirname, '../../container.html'));

test.meta({ browserSize: [700, 700] })('Popup can not be dragged outside of the container (window)', async (t) => {
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
}).before(async () => createWidget('dxPopup', {
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

const renderSwatchScope = ClientFunction(() => {
  const host = document.createElement('div');

  host.id = 'swatchHost';
  host.innerHTML = '<div id="swatchViewPort" class="dx-viewport" style="position: absolute; top: 0; left: 0; width: 600px; height: 600px">'
    + '<div><div class="dx-swatch-custom"><div id="swatchPopup"></div></div></div>'
    + '</div>';

  document.body.appendChild(host);

  (window as any).swatchPreviousViewPort = (window as any).DevExpress.viewPort();
  (window as any).DevExpress.viewPort('#swatchViewPort');
});

const clearSwatchScope = ClientFunction(() => {
  (window as any).widget?.dispose();

  document.querySelector('#swatchHost')?.remove();

  (window as any).DevExpress.viewPort((window as any).swatchPreviousViewPort);
});

test.meta({ browserSize: [700, 700] })('Popup inside a swatch can be dragged', async (t) => {
  const popup = new Popup(Selector('.swatch-popup'));

  const topBefore = await popup.content.getBoundingClientRectProperty('top');
  const leftBefore = await popup.content.getBoundingClientRectProperty('left');

  await t
    .drag(popup.topToolbar, 50, 50);

  await t
    .expect(await popup.content.getBoundingClientRectProperty('top'))
    .eql(topBefore + 50);

  await t
    .expect(await popup.content.getBoundingClientRectProperty('left'))
    .eql(leftBefore + 50);
}).before(async () => {
  await renderSwatchScope();

  return createWidget('dxPopup', {
    width: 100,
    height: 100,
    visible: true,
    dragEnabled: true,
    animation: undefined,
    position: { of: '#swatchViewPort' },
    wrapperAttr: { class: 'swatch-popup' },
  }, '#swatchPopup');
}).after(async () => {
  await clearSwatchScope();
});
