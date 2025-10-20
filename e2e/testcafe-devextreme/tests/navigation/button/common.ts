import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ButtonType } from 'devextreme/common';
import { Selector } from 'testcafe';
import { testScreenshot } from '../../../helpers/themeUtils';
import {
  addCaptionTo,
  appendElementTo,
  insertStylesheetRulesToPage,
  setAttribute,
  setClassAttribute,
  setStyleAttribute,
} from '../../../helpers/domUtils';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

fixture.disablePageReloads`Button`
  .page(url(__dirname, '../../container.html'));

['text', 'outlined', 'contained'].forEach((stylingMode) => {
  const testName = `Buttons, stylingMode=${stylingMode}`;
  test(testName, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, `${testName}.png`, {
      element: '#container',
    });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    const typedButtons = ['danger', 'default', 'normal', 'success'].map((type: ButtonType) => ({
      type,
      text: `${type[0].toUpperCase()}${type.slice(1)}`,
    }));
    const iconButtons = [
      { icon: 'find', text: 'Find' },
      { icon: 'find' },
      {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 24 24" fill="currentColor">
             <path d="M11.8834 3.00673L12 3C12.5128 3 12.9355 3.38604 12.9933 3.88338L13 4V11H20C20.5128 11 20.9355 11.386 20.9933 11.8834L21 12C21 12.5128 20.614 12.9355 20.1166 12.9933L20 13H13V20C13 20.5128 12.614 20.9355 12.1166 20.9933L12 21C11.4872 21 11.0645 20.614 11.0067 20.1166L11 20V13H4C3.48716 13 3.06449 12.614 3.00673 12.1166L3 12C3 11.4872 3.38604 11.0645 3.88338 11.0067L4 11H11V4C11 3.48716 11.386 3.06449 11.8834 3.00673L12 3L11.8834 3.00673Z"/>
           </svg>`,
      },
    ];
    const buttons = [
      ...typedButtons,
      ...iconButtons,
    ];

    await setAttribute('#container', 'class', 'dx-theme-generic-typography');
    await setAttribute('#container', 'style', 'width: fit-content; padding: 8px;');

    const states = ['default', 'focused', 'hover', 'active', 'selected', 'disabled'];

    // eslint-disable-next-line no-restricted-syntax
    for (const state of states) {
      await appendElementTo('#container', 'div', `mode${state}`, {});
      await setAttribute(`#mode${state}`, 'style', 'display: flex; gap: 8px; margin-bottom: 16px;');
      await addCaptionTo(`#mode${state}`, state);

      await Promise.all(buttons.map(
        (_, index) => appendElementTo(`#mode${state}`, 'div', `button-${state}-${index}`, {}),
      ));

      await Promise.all(buttons.map(
        (defaultConfig, index) => createWidget('dxButton', {
          ...defaultConfig,
          stylingMode,
          disabled: state === 'disabled',
        }, `#button-${state}-${index}`),
      ));

      if (state !== 'default' && state !== 'disabled') {
        await Promise.all(
          buttons.map((_, index) => setClassAttribute(Selector(`#button-${state}-${index}`), `dx-state-${state}`)),
        );
      }
    }
  });
});

test('Button in rtl modes', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Button in rtl modes.png', {
    element: '#container',
  });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await setAttribute('#container', 'style', 'width: fit-content; padding: 8px; display: grid; grid-template-columns: repeat(3, auto); grid-gap: 16px;');

  const buttons = [
    { icon: 'find', text: 'Button text' },
    { icon: 'find', text: 'Long button text' },
    { icon: 'find', text: 'Long button text', width: 150 },
    { icon: 'find', text: 'Button text', rtlEnabled: true },
    { icon: 'find', text: 'Long button text', rtlEnabled: true },
    {
      icon: 'find', text: 'Long button text', width: 150, rtlEnabled: true,
    },
  ];

  await Promise.all(buttons.map(
    (_, index) => appendElementTo('#container', 'div', `button-${index}`, {}),
  ));

  await Promise.all(buttons.map(
    (config, index) => createWidget('dxButton', {
      ...config,
    }, `#button-${index}`),
  ));
});

test('Button: svg icon as background should be fit within icon element (T1178813)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Button with svg icon as background.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await insertStylesheetRulesToPage('.dx-icon-custom { background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAB4klEQVR4nO3WTYiPURQG8N/M+ByEjQUxRQpJKSkhFigLo8jGQqGURDZY2CMpliI2PhZslLKxJBaUCCkUMxELja8pwoxuncW7mZn3fe9fb2meuqt7n+c8995z7zmMojVox1G81RDOYhBvmgi+LIKncakJA5cj+ABWNGHgQxg4pyG8xxmM/VcBVuMCXuIbenELe9GFiViH47iLd+jHq0jOBXUDT8a1QoINNX6OMP8Lx+KplkYnHoTARxyOnUzCHOzATXzHHzzHSWzATEzHRtwuGEnzpXExSA8xY5h1bZgwzHwHHodWStZSWBy76sMseTgQwb9gVVnSqSCle8vBuLi+pLWtCvFRkJZnGlgTOk+qEj8FcWqmgd2hc74q8UcQx2ca2BU66Q+phN4gzs40sDJ0XlT9A+4FcX2mgY4oz0nrSBXiiTofxxDYElVyIOpF+shGxNow0IMxLTCxJ37MpHm6DKENz4KwXWtwJ/T2lyXsLJzClMzg3YWaUlqrHfeDeCVOpQ464xUknX1VyYvwtXB3lZ5SrL8a/Kd1G5Zu/A6RVFqXxjFujl4w7e4zXkfvsBXTMA83gpeakyUysClEBmuM/uiWstEVPUJPXEvKj0NYGDVjPg5GtvdF+b2Oua0IPor/G38BnW+XcSzQwtUAAAAASUVORK5CYII="); }');

  await setStyleAttribute(Selector('#container'), 'width: 300px; height: 200px;');
  await appendElementTo('#container', 'div', 'button');
  await appendElementTo('#container', 'div', 'fixedWidthButton');
  await appendElementTo('#container', 'div', 'iconOnlyButton');

  await createWidget('dxButton', {
    text: 'svg icon',
    icon: 'custom',
  }, '#button');

  await createWidget('dxButton', {
    text: 'fixed width + svg icon',
    icon: 'custom',
    width: 200,
  }, '#fixedWidthButton');

  await createWidget('dxButton', {
    icon: 'custom',
  }, '#iconOnlyButton');
});
