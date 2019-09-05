import { pathToFileURL } from 'url';
import { join } from  'path';

export default (currentDir: string, pagePath: string): string =>
    pathToFileURL(join(currentDir, pagePath)).href;
