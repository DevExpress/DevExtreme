import net from 'net';
import * as sass from 'sass';
import path from 'path';
import fs from 'fs';

import { metadata } from '../data/metadata';
import Compiler from '../../src/modules/compiler';
import DartClient from '../../src/modules/dart-client';

import noModificationsMeta from '../data/compilation-results/no-changes-meta';

jest.mock('../../src/data/metadata/dx-theme-builder-metadata', () => ({
  __esModule: true,
  metadata,
}));

const dataPath: string = path.join(path.resolve(), 'tests', 'data');
const indexFileName = path.join(dataPath, 'scss', 'widgets', 'generic', '_index.scss');
const defaultIndexFileContent = fs.readFileSync(indexFileName, 'utf8');
const includePaths = [path.join(dataPath, 'scss', 'widgets', 'generic')];
const file = path.join(dataPath, 'scss', 'bundles', 'dx.light.scss');

describe('compile with server support', () => {
  const errorMessage = 'Unable to parse dart server response:';
  const createServer = (error: boolean): net.Server => net.createServer((socket) => {
    socket.on('data', (data) => {
      if (error) {
        const reply = { error: errorMessage };
        socket.write(JSON.stringify(reply));
        socket.end();
        return;
      }

      const config = JSON.parse(data.toString());
      const compiler = new Compiler();
      let compilerOptions: sass.Options = {
        includePaths,
        importer: compiler.setter.bind(compiler),
        functions: {
          'collector($map)': compiler.collector.bind(compiler),
        },
      };

      compilerOptions = { ...compilerOptions, ...config };
      compiler.indexFileContent = config.index;

      compiler.nodeCompiler(
        compilerOptions,
        (compilerResult) => {
          const serverResult = {
            css: compilerResult.result.css.toString(),
            changedVariables: compilerResult.changedVariables,
          };
          const resultString = JSON.stringify(serverResult);
          socket.write(resultString);
          socket.end();
        },
        () => {},
      );
    });
  });

  let server: net.Server = null;

  const startServer = (error = false): Promise<void> => new Promise((resolve) => {
    server = createServer(error);
    server.listen(new DartClient().serverPort, '127.0.0.1', () => resolve());
  });

  const stopServer = (): Promise<void> => new Promise((resolve) => {
    server.close(() => resolve());
  });

  test('Compile with empty modifications', async () => {
    await startServer();

    const compiler = new Compiler();
    compiler.indexFileContent = defaultIndexFileContent;

    const data = await compiler.compile([], { file });

    // compiled css
    expect(data.result.css.toString()).toBe(`.dx-accordion {
  background-color: "Helvetica Neue", "Segoe UI", helvetica, verdana, sans-serif;
  color: #337ab7;
  background-image: url(icons/icons.woff2);
}
.dx-accordion .from-base {
  background-color: transparent;
  color: #337ab7;
}`);
    // collected variables
    expect(data.changedVariables).toEqual(noModificationsMeta);

    await stopServer();
  });

  test('Get the error in reply', async () => {
    await startServer(true);

    const compiler = new Compiler();
    compiler.indexFileContent = defaultIndexFileContent;
    return compiler.compile([], { file }).catch(async (e) => {
      await stopServer();
      expect(e.message).toEqual(errorMessage);
    });
  });
});
