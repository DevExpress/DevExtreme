import { copyFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { IMD_FILE, NG_SMD_FILE, PATHS } from './common/paths';

const METADATA_DIR = join(PATHS.packages.angular, 'metadata');

mkdirSync(METADATA_DIR, { recursive: true });

copyFileSync(join(PATHS.artifactsDir, NG_SMD_FILE), join(METADATA_DIR, NG_SMD_FILE));
copyFileSync(join(PATHS.artifactsDir, IMD_FILE), join(METADATA_DIR, IMD_FILE));
