import path from 'path';

export const ROOT_DIR = path.join(__dirname, '../../..');
export const ARTIFACTS_DIR = path.join(ROOT_DIR, 'artifacts');
export const INTERNAL_TOOLS_ARTIFACTS = path.join(ROOT_DIR, 'packages', 'devextreme-metadata', 'dist');
export const TS_ARTIFACTS = path.join(ARTIFACTS_DIR, 'ts');
export const JS_ARTIFACTS = path.join(ARTIFACTS_DIR, 'js');
export const CSS_ARTIFACTS = path.join(ARTIFACTS_DIR, 'css');
export const MENU_META = path.join(ROOT_DIR, 'apps', 'demos', 'menuMeta.json');
export const NPM_DIR = path.join(ARTIFACTS_DIR, 'npm');
export const SBOM_ARTIFACTS = path.join(ROOT_DIR, 'packages', 'sbom', 'dist');
