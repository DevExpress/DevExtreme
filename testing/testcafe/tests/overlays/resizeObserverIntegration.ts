import { Selector } from 'testcafe';
import url from '../../helpers/getPageUrl';
import Popup from '../../model/popup';
import asyncForEach from '../../helpers/asyncForEach';

[
  { pageName: 'popupDimensionChangeDuringAnimation.html', messageSuffix: 'content dimension is changed during animation' },
  { pageName: 'popupDimensionOptionChangeDuringAnimation.html', messageSuffix: 'popup dimension option is changed during animation' },
  { pageName: 'popupContentDimensionChange.html', messageSuffix: 'content dimension is changed' },
].forEach(({ pageName, messageSuffix }) => {
  fixture`Popup`
    .page(url(__dirname, `./pages/resizeObserverIntegration/${pageName}`))
    .beforeEach(async (t) => { await t.wait(10000); });

  test(`Popup should be centered regarding the container even if ${messageSuffix}`, async (t) => {
    const popup = new Popup('#popup');
    const { wrapper, content } = popup;

    const wrapperRect: { bottom: number; top: number; left: number; right: number } = {
      bottom: 0, top: 0, left: 0, right: 0,
    };
    const contentRect: { bottom: number; top: number; left: number; right: number } = {
      bottom: 0, top: 0, left: 0, right: 0,
    };

    await asyncForEach(['bottom', 'left', 'right', 'top'], async (prop) => {
      wrapperRect[prop] = await wrapper.getBoundingClientRectProperty(prop);
      contentRect[prop] = await content.getBoundingClientRectProperty(prop);
    });

    const wrapperVerticalCenter = (wrapperRect.bottom + wrapperRect.top) / 2;
    const wrapperHorizontalCenter = (wrapperRect.left + wrapperRect.right) / 2;
    const contentVerticalCenter = (contentRect.bottom + contentRect.top) / 2;
    const contentHorizontalCenter = (contentRect.left + contentRect.right) / 2;

    await t
      .expect(wrapperVerticalCenter)
      .within(contentVerticalCenter - 0.5, contentVerticalCenter + 0.5);

    await t
      .expect(wrapperHorizontalCenter)
      .within(contentHorizontalCenter - 0.5, contentHorizontalCenter + 0.5);
  });
});

fixture`Popup width/height animation`
  .page(url(__dirname, './pages/resizeObserverIntegration/popupSizesAnimation.html'))
  .beforeEach(async (t) => { await t.wait(10000); });

test('Popup dimensions should be correct after width or height animation', async (t) => {
  const popup = new Popup('#popup');
  const { content } = popup;

  const contentRect: { width: number; height: number } = {
    width: 0, height: 0,
  };

  await asyncForEach(['width', 'height'], async (prop) => {
    contentRect[prop] = await content.getBoundingClientRectProperty(prop);
  });

  await t
    .expect(contentRect.width)
    .eql(300);

  await t
    .expect(contentRect.height)
    .eql(300);
});

fixture`Resize during animation`
  .page(url(__dirname, './pages/resizeObserverIntegration/shownAfterResizeDuringAnimation.html'))
  .beforeEach(async (t) => { await t.wait(10000); });

test('Showing and shown events should be raised only once even after resize during animation', async (t) => {
  const shownCallCount = Number(await Selector('#shown_call_count').innerText);
  const showingCallCount = Number(await Selector('#showing_call_count').innerText);

  await t
    .expect(shownCallCount)
    .eql(1);
  await t
    .expect(showingCallCount)
    .eql(1);
});
