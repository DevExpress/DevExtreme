import type { Properties } from 'devextreme/ui/gallery';
import { testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const gallery = [
  {
    imageAlt: 'Image 1',
    imageSrc: '../../../images/1.jpg',
  },
  {
    imageAlt: 'Image 2',
    imageSrc: '../../../images/2.jpg',
  },
  {
    imageAlt: 'Image 3',
    imageSrc: '../../../images/3.jpg',
  },
];

const options: Options<Properties> = {
  height: [300],
  width: [300],
  dataSource: [gallery],
  swipeEnabled: [true, false],
  showIndicator: [true, false],
  showNavButtons: [true, false],
};

const a11yCheckConfig = {};

const configuration: Configuration<Properties> = {
  component: 'dxGallery',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
