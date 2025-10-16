import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Item } from 'devextreme/ui/stepper.d';
import Stepper from 'devextreme-testcafe-models/stepper';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo, setAttribute } from '../../../helpers/domUtils';

fixture.disablePageReloads`Stepper_common`
  .page(url(__dirname, '../../container.html'));

const commonItems: Item[] = [
  { icon: 'cart', label: 'Cart' },
  { icon: 'clipboardtasklist', label: 'Shipping Info' },
  { icon: 'gift', label: 'Promo Code', optional: true },
  { icon: 'packagebox', label: 'Checkout' },
  { icon: 'checkmarkcircle', label: 'Ordered' },
];

['horizontal', 'vertical'].forEach((orientation) => {
  test('Stepper common properties', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    await testScreenshot(t, takeScreenshot, `Stepper orient=${orientation}.png`, {
      element: '#container',
    });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await appendElementTo('#container', 'div', 'stepper');
    await appendElementTo('#container', 'div', 'stepper2');

    const containerStyle = orientation === 'horizontal' ? 'width: 800px; flex-direction: column;' : 'height: 600px; width: 400px';
    await setAttribute('#container', 'style', `display: flex; gap: 40px; ${containerStyle}`);

    const stepperOptions = {
      selectedIndex: 4,
      orientation,
      dataSource: commonItems,
    };

    const stepperRTLOptions = {
      ...stepperOptions,
      rtlEnabled: true,
    };

    await createWidget('dxStepper', stepperOptions, '#stepper');

    return createWidget('dxStepper', stepperRTLOptions, '#stepper2');
  });
});

test('Stepper text overflow in horizontal orientation', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await testScreenshot(t, takeScreenshot, 'Stepper text overflow orient=horizontal.png', { element: '#parentContainer' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'stepper');
  await setAttribute('#container', 'style', 'width: 200px; height: 150px; overflow: auto;');

  await appendElementTo('#otherContainer', 'div', 'stepper2');
  await setAttribute('#otherContainer', 'style', 'width: 400px; height: 150px; overflow: auto;');

  await setAttribute('#parentContainer', 'style', 'width: 400px;');

  const stepperOptions = {
    dataSource: commonItems,
  };

  await createWidget('dxStepper', stepperOptions, '#stepper');

  return createWidget('dxStepper', stepperOptions, '#stepper2');
});

test('Stepper text overflow in vertical orientation', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await testScreenshot(t, takeScreenshot, 'Stepper text overflow orient=vertical.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'stepper');
  await appendElementTo('#container', 'div', 'stepper2');
  await setAttribute('#container', 'style', 'display: flex; gap: 40px; width: 400px');

  const stepperOptions = {
    dataSource: commonItems,
    width: 120,
    height: 400,
    orientation: 'vertical',
  };

  const stepperRTLOptions = {
    ...stepperOptions,
    rtlEnabled: true,
  };

  await createWidget('dxStepper', stepperOptions, '#stepper');

  return createWidget('dxStepper', stepperRTLOptions, '#stepper2');
});

[true, false].forEach((selectOnFocus) => {
  test('Stepper item states', async (t) => {
    const state = selectOnFocus ? 'selected' : 'focused';

    await t.pressKey('tab');

    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    await testScreenshot(t, takeScreenshot, `Stepper 1st step selected,selectOnFocus=${selectOnFocus}.png`, { element: '#stepper' });

    await t.pressKey('right');
    await testScreenshot(t, takeScreenshot, `Stepper valid step ${state},selectOnFocus=${selectOnFocus}.png`, { element: '#stepper' });

    await t.pressKey('right');
    await testScreenshot(t, takeScreenshot, `Stepper invalid step ${state},selectOnFocus=${selectOnFocus}.png`, { element: '#stepper' });

    await t.pressKey('right');
    await testScreenshot(t, takeScreenshot, `Stepper disabled step focused,selectOnFocus=${selectOnFocus}.png`, { element: '#stepper' });

    await t.pressKey('right');
    await testScreenshot(t, takeScreenshot, `Stepper disabled valid step focused,selectOnFocus=${selectOnFocus}.png`, { element: '#stepper' });

    await t.pressKey('right');
    await testScreenshot(t, takeScreenshot, `Stepper disabled invalid step focused,selectOnFocus=${selectOnFocus}.png`, { element: '#stepper' });

    await t.pressKey('right');
    await testScreenshot(t, takeScreenshot, `Stepper last step ${state},selectOnFocus=${selectOnFocus}.png`, { element: '#stepper' });

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await appendElementTo('#container', 'div', 'stepper');
    await setAttribute('#container', 'style', 'width: 800px; height: 150px;');

    const dataSource: Item[] = [
      { label: 'Default' },
      { label: 'Valid', isValid: true, optional: true },
      { label: 'Invalid', isValid: false, optional: true },
      {
        label: 'Disabled', icon: 'packagebox', disabled: true, optional: true,
      },
      { label: 'Disabled Valid', disabled: true, isValid: true },
      { label: 'Disabled Invalid', disabled: true, isValid: false },
      { label: 'With Text', text: 'T', optional: true },
    ];

    const stepperOptions = {
      selectOnFocus,
      dataSource,
    };

    return createWidget('dxStepper', stepperOptions, '#stepper');
  });
});

test('Stepper completed item states', async (t) => {
  const stepper = new Stepper('#container');
  await t.click(stepper.getItem(3).element);

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await t.pressKey('left');
  await testScreenshot(t, takeScreenshot, 'Completed invalid step focused.png', { element: '#stepper' });

  await t.pressKey('left');
  await testScreenshot(t, takeScreenshot, 'Completed valid step focused.png', { element: '#stepper' });

  await t.pressKey('left');
  await testScreenshot(t, takeScreenshot, 'Completed step focused.png', { element: '#stepper' });

  await t.click('body', {
    offsetX: -10,
    offsetY: -10,
  });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'stepper');
  await setAttribute('#container', 'style', 'width: 800px; height: 150px;');

  const dataSource: Item[] = [
    { label: 'Default' },
    { label: 'Valid', isValid: true, optional: true },
    { label: 'Invalid', isValid: false, optional: true },
    { label: 'With Text', text: 'T', optional: true },
  ];

  const stepperOptions = {
    selectOnFocus: false,
    dataSource,
    selectedIndex: 3,
  };

  return createWidget('dxStepper', stepperOptions, '#stepper');
});
