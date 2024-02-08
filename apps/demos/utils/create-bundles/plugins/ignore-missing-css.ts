import * as fs from 'fs';
import * as path from 'path';
import { Plugin } from 'esbuild';

const ignoreMissingCssPlugin: Plugin = {
  name: 'ignore-missing-css',
  setup(build) {
    build.onResolve({ filter: /\.css$/ }, (args) => {
      const fullPath = path.resolve(args.resolveDir, args.path);
      if (!fs.existsSync(fullPath)) {
        return { path: args.path, namespace: 'ignore-missing-css' };
      }
    });

    build.onLoad({ filter: /\.css$/, namespace: 'ignore-missing-css' }, (args) => ({
      contents: '',
      loader: 'css',
    }));
  },
};

export default ignoreMissingCssPlugin;
