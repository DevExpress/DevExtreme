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
  arrayBuffer: async () => new ArrayBuffer(1024),
  slice: (start: number, end: number, contentType?: string) => new Blob(),
  stream: () => new ReadableStream(),
  text: async () => 'File text',
}];

const options: Options<Properties> = {
  value: [undefined, file],
  visible: [true, false],
  multiple: [true, false],
  disabled: [true, false],
  readOnly: [true, false],
  hint: [undefined, 'hint'],
  name: ['', 'name'],
  height: [undefined, 250],
  width: [undefined, 250],
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
