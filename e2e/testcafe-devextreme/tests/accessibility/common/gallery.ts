import { Properties } from 'devextreme/ui/gallery.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const gallery = [
  {
    imageAlt: 'Image 1',
    imageSrc: '../../images/1.jpg',
  },
  {
    imageAlt: 'Image 2',
    imageSrc: '../../images/2.jpg',
  },
  {
    imageAlt: 'Image 3',
    imageSrc: '../../images/3.jpg',
  },
];

const options: Options<Properties> = {
  height: [300],
  width: [300],
  dataSource: [gallery],
  loop: [true, false],
  swipeEnabled: [true, false],
  showIndicator: [true, false],
  showNavButtons: [true, false],
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxGallery',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
