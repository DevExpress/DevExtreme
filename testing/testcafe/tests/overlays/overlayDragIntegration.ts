import url from '../../helpers/getPageUrl';
import Popup from '../../model/popup';
import asyncForEach from '../../helpers/asyncForEach';

fixture`Popup drag in window`
  .page(url(__dirname, './pages/overlayDragIntegration/popupDragInWindow.html'))
  .beforeEach(async (t) => { await t.wait(10000); });

test('Popup should drag in window when viewport/container/dragArea are not defined', async (t) => {
  const popup = new Popup('#popup');
  const { content, toolbar } = popup;

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
    .eql(newPopupPosition.top - 50);

  await t
    .expect(popupPosition.left)
    .eql(newPopupPosition.left - 50);
});

[
  { pageName: 'popupDragInViewport.html', messageSuffix: 'viewport when it is defined' },
  { pageName: 'popupDragInContainer.html', messageSuffix: 'container when dragArea is not defined and container is defined' },
  { pageName: 'popupDragInDragArea.html', messageSuffix: 'dragArea.container when it defined' },
].forEach(({ pageName, messageSuffix }) => {
  fixture`Popup drag in container/vieport/dragArea`
    .page(url(__dirname, `./pages/overlayDragIntegration/${pageName}`))
    .beforeEach(async (t) => { await t.wait(10000); });

  test(`Popup should drag in ${messageSuffix}`, async (t) => {
    const outerPopup = new Popup('#popup');
    const wrapper = outerPopup.content.find('.dx-overlay-wrapper');
    const content = wrapper.find('.dx-overlay-content');
    const toolbar = wrapper.find('.dx-popup-title');

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
      .eql(newPopupPosition.top - 50);

    await t
      .expect(popupPosition.left)
      .eql(newPopupPosition.left - 50);
  });
});

fixture`Popup drag borders`
  .page(url(__dirname, './pages/overlayDragIntegration/popupDragBorders.html'))
  .beforeEach(async (t) => { await t.wait(10000); });

test('Popup can not be dragged outside of the container (window)', async (t) => {
  const popup = new Popup('#popup');
  const { content, toolbar } = popup;

  const popupRect: { bottom: number; top: number; left: number; right: number } = {
    bottom: 0, top: 0, left: 0, right: 0,
  };

  await t
    .resizeWindow(700, 700)
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
});

fixture`Popup drag in small container`
  .page(url(__dirname, './pages/overlayDragIntegration/popupDragWhenContentBiggerThanContainer.html'))
  .beforeEach(async (t) => { await t.wait(10000); });

test('Popup can not be dragged if content bigger than container', async (t) => {
  const outerPopup = new Popup('#popup');
  const wrapper = outerPopup.content.find('.dx-overlay-wrapper');
  const content = wrapper.find('.dx-overlay-content');
  const toolbar = wrapper.find('.dx-popup-title');

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
});

fixture`Popup drag with outside multiplayer`
  .page(url(__dirname, './pages/overlayDragIntegration/popupDragWithOutsideMultiplayer.html'))
  .beforeEach(async (t) => { await t.wait(10000); });

test('Popup can be dragged outside of the container if outside multiplayer is enabled', async (t) => {
  const popup = new Popup('#popup');
  const { content, toolbar } = popup;

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
});
