import { pathToFileURL } from 'url';
import { join } from 'path';

export default (currentDir: string, pagePath: string): string => {
  const path = join(currentDir, pagePath);

  return pathToFileURL(path).href;
};
