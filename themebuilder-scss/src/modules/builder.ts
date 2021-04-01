import normalize from './config-normalizer';
import CompileManager from './compile-manager';
import { ConfigSettings, PackageResult } from '../types/types';

export const buildTheme = (config: ConfigSettings): Promise<PackageResult> => {
  normalize(config);
  const compileManager = new CompileManager();
  return compileManager.compile(config);
};

// compatibility default export
export default { buildTheme };
