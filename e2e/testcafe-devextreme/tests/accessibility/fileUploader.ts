import { Properties } from 'devextreme/ui/file_uploader.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const file: File[] = [{
  lastModified: Date.now(),
  name: 'Item_1.png',
  type: 'image/png',
  size: 1024,
  webkitRelativePath: '',
  slice: () => new Blob(),
  stream: () => new ReadableStream(),
  text: () => Promise.resolve('File text'),
  arrayBuffer: () => Promise.resolve(new ArrayBuffer(1024)),
}];

const options: Options<Properties> = {
  value: [file],
  multiple: [true, false],
  disabled: [true, false],
  readOnly: [true, false],
  hint: [undefined, 'hint'],
  name: ['', 'name'],
  focusStateEnabled: [true],
  inputAttr: [{ 'aria-label': 'aria-label' }],
};

const a11yCheckConfig = {
  // NOTE: color-contrast issues
  rules: { 'color-contrast': { enabled: false } },
};

const configuration: Configuration = {
  component: 'dxFileUploader',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
