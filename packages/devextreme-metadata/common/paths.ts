import { join, resolve } from 'path';

const PACKAGES = resolve('..');
export const PATHS = {
  artifactsDir: resolve('./dist'),
  packagesDir: PACKAGES,
  packages: {
    react: join(PACKAGES, 'devextreme-react'),
    angular: join(PACKAGES, 'devextreme-angular'),
    vue: join(PACKAGES, 'devextreme-vue'),
  },
};

export const IMD_FILE = 'integration-data.json';
export const NG_SMD_FILE = 'NGMetaData.json';
