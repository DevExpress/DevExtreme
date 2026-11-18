import type { Properties } from 'devextreme/ui/file_uploader';
import { testAccessibility, type Configuration } from '../../helpers/accessibility/test';
import type { Options } from '../../helpers/generateOptionMatrix';

const file = [{
  lastModified: Date.now(),
  name: 'Item_1.png',
  type: 'image/png',
  size: 1024,
  webkitRelativePath: '',
  slice: () => new Blob(),
  stream: () => new ReadableStream(),
  text: () => Promise.resolve('File text'),
  arrayBuffer: () => Promise.resolve(new ArrayBuffer(1024)),
}] as File[];

const options: Options<Properties> = {
  value: [file],
  multiple: [true, false],
  focusStateEnabled: [true],
  inputAttr: [{ 'aria-label': 'aria-label' }],
};

const a11yCheckConfig = {};

const availabilityConfiguration: Configuration<Properties> = {
  component: 'dxFileUploader',
  a11yCheckConfig,
  options: {
    ...options,
    disabled: [true, false],
    readOnly: [true, false],
  },
};

testAccessibility(availabilityConfiguration);

const infoConfiguration: Configuration<Properties> = {
  component: 'dxFileUploader',
  name: 'info',
  a11yCheckConfig,
  options: {
    ...options,
    name: ['', 'name'],
  },
};

testAccessibility(infoConfiguration);
