import { ClientFunction } from 'testcafe';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import { clearTestPage } from '../../helpers/testPageUtils';
import { getThemeName } from '../../helpers/themeUtils';

if (getThemeName() === 'fluent-next') {
  fixture`Viz palettes`
    .page(url(__dirname, '../container.html'))
    .afterEach(async (t) => { await clearTestPage(t); });

  const COUNT = 50;
  const ROUNDING_APART = 2;
  const LITERALS = ['#0078d4', '#c83d3d', '#008f04', '#eaa300', '#e43ba6', '#865cbf'];

  const distancesOver = ClientFunction((
    extensionMode: string,
    count: number,
    literals: string[],
  ) => {
    const { viz } = (window as any).DevExpress;

    viz.registerPalette('legacy literals', {
      simpleSet: literals,
      indicatingSet: [literals[2], literals[3], literals[1]],
      gradientSet: [literals[0], literals[2]],
      accentColor: '#0f6cbd',
    });

    const channelsOf = (color: string): number[] => {
      const probe = document.createElement('div');

      probe.style.cssText = 'position: absolute; visibility: hidden';
      probe.style.backgroundColor = color;
      document.body.appendChild(probe);

      const painted = getComputedStyle(probe).backgroundColor;

      probe.remove();

      const scale = painted.startsWith('color(') ? 255 : 1;

      return (painted.match(/-?[\d.]+/g) ?? []).slice(0, 3)
        .map((channel) => Math.round(Math.min(255, Math.max(0, Number(channel) * scale))));
    };

    const generated = (palette: string): string[] => viz
      .generateColors(palette, count, { paletteExtensionMode: extensionMode, useHighlight: true });

    const fromNames = generated('Fluent Next').map(channelsOf);
    const fromLiterals = generated('legacy literals').map(channelsOf);

    return fromNames.map((channels: number[], index: number) => Math.max(
      ...channels.map((channel, at) => Math.abs(channel - fromLiterals[index][at])),
    ));
  });

  const handedOut = ClientFunction(() => {
    const series = (window as any).widget.getAllSeries();

    return [
      ...series.map((one: { getColor: () => string }) => one.getColor()),
      ...series[0].getAllPoints().map((point: { getColor: () => string }) => point.getColor()),
    ];
  });

  test('a chart hands out colours an application can draw with, not references', async (t) => {
    const handed = await handedOut();
    const unusable = handed.filter((color) => !/^(#[0-9a-f]{6}|rgba?\()/i.test(color));

    await t.expect(handed.length).gt(0, 'the chart answered with colours');
    await t.expect(unusable).eql([], 'every colour is one an application can parse');
  }).before(async () => {
    await createWidget('dxChart', {
      dataSource: [{ arg: 'a', val: 1 }, { arg: 'b', val: 2 }],
      series: [{ type: 'bar' }, { type: 'bar' }],
      animation: { enabled: false },
      size: { width: 300, height: 200 },
    });
  });

  ['blend', 'alternate', 'extrapolate'].forEach((extensionMode) => {
    test(`the browser mixes ${extensionMode} into the same colors the old arithmetic did`, async (t) => {
      const distances = await distancesOver(extensionMode, COUNT, LITERALS);
      const furthest = Math.max(...distances);
      const drifted = distances.filter((distance) => distance > ROUNDING_APART).length;

      await t.expect(distances.length).eql(COUNT, 'every colour of the run was compared');
      await t.expect(drifted).eql(
        0,
        `${drifted} of ${COUNT} colours differ by more than ${ROUNDING_APART} of 255, the furthest by ${furthest}`,
      );
    });
  });
}
