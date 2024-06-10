import path from 'path';

export const ROOT_DIR = path.join(__dirname, '../../..');
export const ARTIFACTS_DIR = path.join(ROOT_DIR, 'artifacts');
export const INTERNAL_TOOLS_ARTIFACTS = path.join(ARTIFACTS_DIR, 'internal-tools');
export const TS_ARTIFACTS = path.join(ARTIFACTS_DIR, 'ts');
export const JS_ARTIFACTS = path.join(ARTIFACTS_DIR, 'js');
export const CSS_ARTIFACTS = path.join(ARTIFACTS_DIR, 'css');
export const DEPS_SCANNER_ARTIFACTS = path.join(ARTIFACTS_DIR, 'deps-scanner');
export const NPM_DIR = path.join(ARTIFACTS_DIR, 'npm');
