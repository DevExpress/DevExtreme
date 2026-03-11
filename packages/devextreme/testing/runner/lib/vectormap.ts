import { ChildProcess, spawn, spawnSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as http from 'node:http';
import * as path from 'node:path';

import {
  JsonObject,
  JsonValue,
  VectorMapDataItem,
  VectorMapOutputItem,
} from './types';

const VECTOR_SERVER_RETRY_TIMEOUT_MS = 5000;
const VECTOR_SERVER_RETRY_DELAY_MS = 50;
const VECTOR_SERVER_KILL_DELAY_MS = 200;

interface VectorMapServiceOptions {
  packageRoot: string;
  testingRoot: string;
  vectorDataDirectory: string;
  vectorMapTesterPort: number;
  pathToNode: string;
}

export interface VectorMapService {
  executeVectorMapConsoleApp: (searchParams: URLSearchParams) => VectorMapOutputItem[];
  readThemeCssFiles: () => string[];
  readVectorMapTestData: () => VectorMapDataItem[];
  redirectRequestToVectorMapNodeServer: (action: string, arg: string) => Promise<string>;
}

interface VectorMapNodeServerState {
  process: ChildProcess | null;
  refs: number;
  killTimer: NodeJS.Timeout | null;
}

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isJsonValue(value: unknown): value is JsonValue {
  if (
    value === null
    || typeof value === 'string'
    || typeof value === 'number'
    || typeof value === 'boolean'
  ) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every((item) => isJsonValue(item));
  }

  if (isJsonObject(value)) {
    return Object.values(value).every((item) => isJsonValue(item));
  }

  return false;
}

function getErrorCode(error: Error): string | null {
  if ('code' in error && typeof error.code === 'string') {
    return error.code;
  }

  return null;
}

function parseJsonContent(content: string, filePath: string): JsonValue {
  const parsed = JSON.parse(content) as unknown;

  if (!isJsonValue(parsed)) {
    throw new Error(`Unsupported JSON structure in ${filePath}`);
  }

  return parsed;
}

function wait(timeout: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

function httpGetText(targetUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const request = http.get(targetUrl, (response) => {
      const chunks: Buffer[] = [];

      response.on('data', (chunk: Buffer | string) => {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      });

      response.on('end', () => {
        resolve(Buffer.concat(chunks).toString('utf8'));
      });
    });

    request.on('error', reject);
  });
}

export function createVectorMapService({
  packageRoot,
  testingRoot,
  vectorDataDirectory,
  vectorMapTesterPort,
  pathToNode,
}: VectorMapServiceOptions): VectorMapService {
  const vectorMapNodeServer: VectorMapNodeServerState = {
    process: null,
    refs: 0,
    killTimer: null,
  };

  function readThemeCssFiles(): string[] {
    const bundlesPath = path.join(packageRoot, 'scss', 'bundles');
    const result: string[] = [];

    if (!fs.existsSync(bundlesPath)) {
      return result;
    }

    fs.readdirSync(bundlesPath, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .forEach((entry) => {
        const bundleDirectory = path.join(bundlesPath, entry.name);
        fs.readdirSync(bundleDirectory, { withFileTypes: true })
          .filter((file) => file.isFile() && file.name.endsWith('.scss'))
          .forEach((file) => {
            result.push(`${path.basename(file.name, '.scss')}.css`);
          });
      });

    return result;
  }

  function readVectorMapTestData(): VectorMapDataItem[] {
    if (!fs.existsSync(vectorDataDirectory)) {
      return [];
    }

    return fs.readdirSync(vectorDataDirectory, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith('.txt'))
      .map((entry) => {
        const filePath = path.join(vectorDataDirectory, entry.name);
        return {
          name: path.basename(entry.name, '.txt'),
          expected: fs.readFileSync(filePath, 'utf8'),
        };
      });
  }

  function acquireVectorMapNodeServer(): void {
    if (vectorMapNodeServer.killTimer !== null) {
      clearTimeout(vectorMapNodeServer.killTimer);
      vectorMapNodeServer.killTimer = null;
    }

    if (vectorMapNodeServer.process === null || vectorMapNodeServer.process.killed) {
      const scriptPath = path.join(testingRoot, 'helpers', 'vectormaputils-tester.js');

      vectorMapNodeServer.process = spawn(
        pathToNode,
        [scriptPath, `${vectorDataDirectory}${path.sep}`],
        {
          stdio: 'ignore',
        },
      );

      vectorMapNodeServer.process.on('exit', () => {
        if (vectorMapNodeServer.process?.exitCode != null) {
          vectorMapNodeServer.process = null;
        }
      });
    }

    vectorMapNodeServer.refs += 1;
  }

  function releaseVectorMapNodeServer(): void {
    vectorMapNodeServer.refs -= 1;

    if (vectorMapNodeServer.refs <= 0) {
      vectorMapNodeServer.refs = 0;

      vectorMapNodeServer.killTimer = setTimeout(() => {
        if (vectorMapNodeServer.refs === 0 && vectorMapNodeServer.process !== null) {
          try {
            vectorMapNodeServer.process.kill();
          } catch {
            // Ignore process kill failures.
          }
          vectorMapNodeServer.process = null;
        }
        vectorMapNodeServer.killTimer = null;
      }, VECTOR_SERVER_KILL_DELAY_MS);
    }
  }

  async function requestWithRetryUntilReady(
    action: string,
    arg: string,
    startTime: number,
  ): Promise<string> {
    try {
      return await httpGetText(`http://127.0.0.1:${vectorMapTesterPort}/${action}/${arg}`);
    } catch (error) {
      if (Date.now() - startTime > VECTOR_SERVER_RETRY_TIMEOUT_MS) {
        throw error;
      }

      await wait(VECTOR_SERVER_RETRY_DELAY_MS);
      return requestWithRetryUntilReady(action, arg, startTime);
    }
  }

  async function redirectRequestToVectorMapNodeServer(
    action: string,
    arg: string,
  ): Promise<string> {
    acquireVectorMapNodeServer();

    try {
      return await requestWithRetryUntilReady(action, arg, Date.now());
    } finally {
      releaseVectorMapNodeServer();
    }
  }

  function executeVectorMapConsoleApp(
    searchParams: URLSearchParams,
  ): VectorMapOutputItem[] {
    const inputDirectory = `${path.join(packageRoot, 'testing', 'content', 'VectorMapData')}${path.sep}`;
    const outputDirectory = path.join(inputDirectory, '__Output');
    const settingsPath = path.join(inputDirectory, '_settings.js');
    const processFileContentPath = path.join(inputDirectory, '_processFileContent.js');
    const vectorMapUtilsNodePath = path.resolve(path.join(packageRoot, 'artifacts/js/vectormap-utils/dx.vectormaputils.node.js'));

    const args = [vectorMapUtilsNodePath, inputDirectory];
    const fileArgument = searchParams.get('file');
    if (fileArgument !== null) {
      args[1] += fileArgument;
    }

    args.push('--quiet', '--output', outputDirectory, '--settings', settingsPath, '--process-file-content', processFileContentPath);

    const isJson = searchParams.has('json');
    if (isJson) {
      args.push('--json');
    }

    fs.mkdirSync(outputDirectory, { recursive: true });

    try {
      const spawnResult = spawnSync(pathToNode, args, {
        timeout: 15000,
        stdio: 'ignore',
      });

      if (spawnResult.error !== undefined) {
        const errorCode = getErrorCode(spawnResult.error);
        if (errorCode !== 'ETIMEDOUT') {
          throw spawnResult.error;
        }
      }

      const extension = isJson ? '.json' : '.js';

      return fs.readdirSync(outputDirectory, { withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
        .map((entry) => {
          const filePath = path.join(outputDirectory, entry.name);
          let text = fs.readFileSync(filePath, 'utf8');
          let variable: string | null = null;

          if (!isJson) {
            const index = text.indexOf('=');
            if (index > 0) {
              variable = text.substring(0, index).trim();
              text = text.substring(index + 1).trim();

              if (text.endsWith(';')) {
                text = text.slice(0, -1).trim();
              }
            }
          }

          return {
            file: `${path.basename(entry.name, extension)}${extension}`,
            variable,
            content: parseJsonContent(text, filePath),
          };
        });
    } finally {
      try {
        fs.rmSync(outputDirectory, { recursive: true, force: true });
      } catch {
        // Ignore cleanup errors.
      }
    }
  }

  return {
    executeVectorMapConsoleApp,
    readThemeCssFiles,
    readVectorMapTestData,
    redirectRequestToVectorMapNodeServer,
  };
}
