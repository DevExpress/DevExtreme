import { Properties } from 'devextreme/ui/map.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture`Accessibility`
  .page(url(__dirname, '../container.html'))
  // avoid `sj_evt is not defined` error
  .skipJsErrors();

const markersData = [
  { location: '40.7825, -73.966111' },
  { location: [40.755833, -73.986389] },
  { location: { lat: 40.753889, lng: -73.981389 } },
  { location: 'Brooklyn Bridge,New York,NY' },
];

const options: Options<Properties> = {
  provider: ['bing'],
  apiKey: [{
    bing: 'Aq3LKP2BOmzWY47TZoT1YdieypN_rB6RY9FqBfx-MDCKjvvWBbT68R51xwbL-AqC',
  }],
  controls: [true, false],
  zoom: [undefined, 10],
  markers: [markersData],
};

const a11yCheckConfig = {
  rules: {
    'color-contrast': { enabled: false },
    'aria-command-name': { enabled: false },
  },
};

const created = async (t: TestController): Promise<void> => {
  await t.wait(3000);
};

const configuration: Configuration = {
  component: 'dxMap',
  a11yCheckConfig,
  options,
  created,
};

testAccessibility(configuration);
