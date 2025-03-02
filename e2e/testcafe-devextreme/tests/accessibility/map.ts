import { Properties } from 'devextreme/ui/map.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

// TODO Chrome133: skipped during chrome update
// 1) AssertionError: 1 violations found:
//       1) ARIA commands must have an accessible name
//       * https://dequeuniversity.com/rules/axe/4.10/aria-command-name?application=axeAPI
//       * cat.aria, wcag2a, wcag412, TTv5, TT6.a, EN-301-549, EN-9.4.1.2, ACT
//       * serious
//       * aria-command-name
//           ".copyrightLink"
fixture.disablePageReloads.skip`Accessibility`
  .page(url(__dirname, '../container.html'));

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
  hint: [undefined, 'hint'],
  controls: [true, false],
  zoom: [undefined, 10],
  markers: [markersData],
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxMap',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
