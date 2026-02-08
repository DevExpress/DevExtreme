import { pathToFileURL } from 'url';
import { join } from 'path';

export default (currentDir: string, pagePath: string): string => {
  const path = pagePath;

  const fullPath = join(currentDir, path);

  return pathToFileURL(fullPath).href;
};
