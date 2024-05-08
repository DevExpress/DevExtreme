import { Properties } from 'devextreme/ui/popover.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';
import {isMaterial, isMaterialBased} from "../../helpers/themeUtils";

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const options: Options<Properties> = {
  width: [300],
  visible: [true, false],
  showTitle: [true, false],
  title: [undefined, 'title'],
  showCloseButton: [true, false],
};

const a11yCheckConfig = isMaterialBased() ? {
  // NOTE: color-contrast issues in Material
  runOnly: isMaterial() ? '' : 'color-contrast',
  rules: { 'color-contrast': { enabled: !isMaterial() } },
} : {};

const configuration: Configuration = {
  component: 'dxPopover',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
