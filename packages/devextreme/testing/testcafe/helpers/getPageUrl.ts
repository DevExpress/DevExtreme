import { pathToFileURL } from 'url';
import { join } from 'path';

export default (currentDir: string, pagePath: string): string => {
  let path = pagePath;

  if (process.env.shadowDom === 'true') {
    const lastIndexOfSlash = path.lastIndexOf('/');

    path = `${path.substring(0, lastIndexOfSlash + 1)}shadowDom/${path.substring(lastIndexOfSlash + 1)}`;
  }

  const fullPath = join(currentDir, path);

  return pathToFileURL(fullPath).href;
};
