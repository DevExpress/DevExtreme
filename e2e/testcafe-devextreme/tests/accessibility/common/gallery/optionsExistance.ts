import { Properties } from 'devextreme/ui/gallery';
import url from '../../../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../../../helpers/accessibility/test';
import { Options } from '../../../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../../../container.html'));

interface GalleryItem {
  ID: string;
  Name: string;
}

const defaultItems: GalleryItem[] = [{
  ID: '1',
  Name: 'First',
}, {
  ID: '2',
  Name: 'Second',
}];

const options: Options<Properties> = {
  items: [undefined, defaultItems],
  width: [undefined, '100%'],
  showIndicator: [undefined, false],
};

const a11yCheckConfig = {
  rules: { 'image-alt': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxGallery',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
