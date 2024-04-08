/* eslint-disable no-restricted-syntax */
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import {
  appendElementTo,
  insertStylesheetRulesToPage,
  removeStylesheetRulesFromPage,
  setAttribute,
  setStyleAttribute,
} from '../../../helpers/domUtils';
import Guid from 'devextreme/core/guid';

const BUTTON_CLASS = 'dx-button';
const BUTTON_TEXT_CLASS = 'dx-button-text';
const ICON_CLASS = 'dx-icon';

const stylingModes = ['text', 'outlined', 'contained'];
const types = ['danger', 'default', 'normal', 'success'];

fixture.disablePageReloads`Button`
  .page(url(__dirname, '../../container.html'));

test('Buttons render', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await insertStylesheetRulesToPage(`.${BUTTON_CLASS} { margin: 5px; }`);

  await testScreenshot(t, takeScreenshot, 'Button render.png', { element: '#container', shouldTestInCompact: true });

  await removeStylesheetRulesFromPage();

  await insertStylesheetRulesToPage(`.${BUTTON_CLASS} { width: 70px; margin: 5px; }`);

  await testScreenshot(t, takeScreenshot, 'Button render with overflow.png', { element: '#container', shouldTestInCompact: true });

  await removeStylesheetRulesFromPage();

  await insertStylesheetRulesToPage(`.${BUTTON_TEXT_CLASS}, .${BUTTON_CLASS} .${ICON_CLASS} { font-size: 26px; } .${BUTTON_CLASS} { margin: 5px; }`);

  await testScreenshot(t, takeScreenshot, 'Button stretch of large text.png', { element: '#container', shouldTestInCompact: true });

  await removeStylesheetRulesFromPage();

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  for (const stylingMode of stylingModes) {
    for (const type of types) {
      for (const text of ['Button Text', '']) {
        for (const icon of ['home', undefined]) {
          for (const rtlEnabled of [true, false]) {
            const id = `${new Guid()}`;

            await appendElementTo('#container', 'div', id, { });
            await createWidget('dxButton', {
              stylingMode,
              text,
              type,
              rtlEnabled,
              icon,
            }, `#${id}`);
          }
        }
      }
    }
  }
});

test('Button: svg icon as background should be fit within icon element (T1178813)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Button with svg icon as background.png', { element: '#container', shouldTestInCompact: true });

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

test('Buttons render in disabled state', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await insertStylesheetRulesToPage(`.${BUTTON_CLASS} { margin: 5px; }`);

  await testScreenshot(t, takeScreenshot, 'Button render in disabled.png', { element: '#container', shouldTestInCompact: true });
  await testScreenshot(t, takeScreenshot, 'Button render in disabled.png', {
    element: '#container',
    theme: process.env.theme?.replace('.light', '.dark'),
  });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await setAttribute('#container', 'class', `dx-theme-${process.env.theme?.split('.')[0]}-typography`);

  for (const stylingMode of stylingModes) {
    for (const type of types) {
      const id = `${new Guid()}`;

      await appendElementTo('#container', 'div', id, { });
      await createWidget('dxButton', {
        stylingMode,
        text: `stylingMode: ${stylingMode}, type: ${type}`,
        type,
        icon: 'home',
        disabled: true,
      }, `#${id}`);
    }
  }
});
