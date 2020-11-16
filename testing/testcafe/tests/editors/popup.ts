import url from '../../helpers/getPageUrl';
import Popup from '../../model/popup';
import asyncForEach from '../../helpers/asyncForEach';

fixture`Popup`
  .page(url(__dirname, './pages/T920408.html'))
  .beforeEach(async (t) => { await t.wait(10000); });

test('Popup should be centered regarding the container even if container is animated (T920408)', async (t) => {
  const outerPopup = new Popup('#popup');
  const wrapper = outerPopup.content.find('.dx-overlay-wrapper');
  const content = wrapper.find('.dx-overlay-content');

  const wrapperRect: {bottom: number; top: number; left: number; right: number} = {
    bottom: 0, top: 0, left: 0, right: 0,
  };
  const contentRect: {bottom: number; top: number; left: number; right: number} = {
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

test('Popup wrapper left top corner should be the same as the container right left corner even if container is animated', async (t) => {
  const outerPopup = new Popup('#popup');
  const wrapper = outerPopup.content.find('.dx-overlay-wrapper');
  const container = wrapper.parent();

  const wrapperRect: {top: number; left: number} = { top: 0, left: 0 };
  const containerRect: {top: number; left: number} = { top: 0, left: 0 };

  await asyncForEach(['left', 'top'], async (prop) => {
    wrapperRect[prop] = await wrapper.getBoundingClientRectProperty(prop);
    containerRect[prop] = await container.getBoundingClientRectProperty(prop);
  });

  await t
    .expect(wrapperRect.top)
    .within(containerRect.top - 0.5, containerRect.top + 0.5);

  await t
    .expect(wrapperRect.left)
    .within(containerRect.left - 0.5, containerRect.left + 0.5);
});

fixture`Popup T946851`
  .page(url(__dirname, './pages/T946851.html'))
  .beforeEach(async (t) => { await t.wait(10000); });

test('There should not be any errors when position.of is html (T946851)', async (t) => {
  await t
    .expect(true).ok();
});
