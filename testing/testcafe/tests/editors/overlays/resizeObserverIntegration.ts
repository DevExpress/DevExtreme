import { Selector, ClientFunction } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import Popup from '../../../model/popup';
import asyncForEach from '../../../helpers/asyncForEach';
import createWidget from '../../../helpers/createWidget';
import { setStyleAttribute, appendElementTo } from '../../navigation/helpers/domUtils';
import { restoreBrowserSize } from '../../../helpers/restoreBrowserSize';

fixture`Popup`
  .page(url(__dirname, '../../container.html'));

test('Popup should be centered regarding the container even if content dimension is changed during animation', async (t) => {
  const popup = new Popup('#container');

  await popup.show();
  await setStyleAttribute(Selector('#content'), 'width: 300px; height: 300px;');

  const wrapper = popup.getWrapper();
  const content = popup.getContent();

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
}).before(async () => createWidget('dxPopup', {
  width: 'auto',
  height: 'auto',
  contentTemplate: () => $('<div>').attr({ id: 'content' }).css({ width: 100, height: 100 }),
}));

test('Popup should be centered regarding the container even if popup dimension option is changed during animation', async (t) => {
  const popup = new Popup('#container');

  await popup.show();
  await setStyleAttribute(Selector('#content'), 'width: 300px; height: 300px;');

  const wrapper = popup.getWrapper();
  const content = popup.getContent();

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
}).before(async () => createWidget('dxPopup', {
  width: 'auto',
  height: 'auto',
  contentTemplate: () => $('<div>').attr({ id: 'content' }).css({ width: 100, height: 100 }),
}));

test('Popup should be centered regarding the container even if content dimension is changed', async (t) => {
  const popup = new Popup('#container');

  await popup.show();
  await setStyleAttribute(Selector('#content'), 'width: 300px; height: 300px;');

  const wrapper = popup.getWrapper();
  const content = popup.getContent();

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
}).before(async () => createWidget('dxPopup', {
  width: 'auto',
  height: 'auto',
  contentTemplate: () => $('<div>').attr({ id: 'content' }).css({ width: 100, height: 100 }),
  animation: null,
}));

test('popup should be repositioned after window resize', async (t) => {
  const popup = new Popup('#container');

  const wrapper = popup.getWrapper();
  const content = popup.getContent();

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
}).before(async (t) => {
  await t.resizeWindow(200, 200);

  return createWidget('dxPopup', {
    animation: null,
    visible: true,
    width: 100,
    height: 100,
  });
}).after(async (t) => {
  await restoreBrowserSize(t);
});

test('Popup dimensions should be correct after width or height animation', async (t) => {
  const popup = new Popup('#container');
  const content = popup.getContent();

  await t.wait(500);

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
}).before(async () => createWidget('dxPopup', {
  visible: true,
  animation: {
    show: {
      from: { width: '10px', height: '10px' },
      to: { width: '300px', height: '300px' },
    },
  },
}));

test('Showing and shown events should be raised only once even after resize during animation', async (t) => {
  const popup = new Popup('#container');

  await popup.show();
  await setStyleAttribute(Selector('#content'), 'width: 300px; height: 300px;');

  const shownCallCount = Number(await Selector('#shown_call_count').innerText);
  const showingCallCount = Number(await Selector('#showing_call_count').innerText);

  await t
    .expect(shownCallCount)
    .eql(1);
  await t
    .expect(showingCallCount)
    .eql(1);
}).before(async () => {
  await appendElementTo('body', 'div', 'shown_call_count', {});
  await appendElementTo('body', 'div', 'showing_call_count', {});

  return createWidget('dxPopup', {
    width: 'auto',
    height: 'auto',
    contentTemplate: () => $('<div>').attr({ id: 'content' }).css({ width: 100, height: 100 }),
    onShown: ClientFunction(() => {
      const callCount = +$('#shown_call_count').text();
      $('#shown_call_count').text(callCount + 1);
    }),
    onShowing: ClientFunction(() => {
      const callCount = +$('#showing_call_count').text();
      $('#showing_call_count').text(callCount + 1);
    }),
  });
});
