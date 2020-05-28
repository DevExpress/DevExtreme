import { join, resolve } from 'path';
import * as sass from 'sass';

export default (theme: string, colorScheme: string): sass.SyncOptions => {
  const dottedColorScheme = colorScheme.replace(/-/g, '.');
  const themePart: string = (theme !== 'generic' ? `${theme}.` : '');
  const basePath = resolve(join(__dirname, '..', 'data', 'scss'));
  const bundlePath = join(basePath, 'bundles', `dx.${themePart}${dottedColorScheme}.scss`);
  const indexPath = join(basePath, 'widgets', theme);

  return {
    file: bundlePath,
    includePaths: [indexPath],
  };
};
