import * as path from 'path';

export const DEFAULT_LICENSE_TEMPLATE_EULA = path.resolve(__dirname, 'license-header-eula.txt');
export const DEFAULT_LICENSE_TEMPLATE_MIT = path.resolve(__dirname, 'license-header-mit.txt');
export const DEFAULT_EULA_URL = 'https://js.devexpress.com/Licensing/';

export const DEFAULT_TARGET_DIR = './npm';
export const DEFAULT_PACKAGE_JSON = './package.json';
export const DEFAULT_INCLUDE_PATTERNS = ['**/*.{ts,js}'] as const;
export const DEFAULT_EXCLUDE_PATTERNS = ['**/*.json', '**/*.map'] as const;
