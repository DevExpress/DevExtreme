import * as fs from 'fs/promises';
import * as fse from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { glob } from 'glob';
import type { PackageJson } from './types';

const ENCODING_UTF8 = 'utf-8';
const PACKAGE_JSON_FILENAME = 'package.json';

export async function ensureDir(dirPath: string): Promise<void> {
  await fse.ensureDir(dirPath);
}

export async function readJson<T = unknown>(filePath: string): Promise<T> {
  const content = await fs.readFile(filePath, ENCODING_UTF8);
  return JSON.parse(content) as T;
}

export async function writeJson(
  filePath: string,
  data: unknown,
  spaces: number = 2,
): Promise<void> {
  const content = JSON.stringify(data, null, spaces);
  await fs.writeFile(filePath, content, ENCODING_UTF8);
}

export async function processFiles(
  pattern: string,
  processor: (filePath: string) => Promise<void>,
  options: { ignore?: string[] } = {},
): Promise<number> {
  const files = await glob(pattern, {
    absolute: true,
    nodir: true,
    ignore: options.ignore,
  });

  await Promise.all(files.map(processor));
  return files.length;
}

export async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function copyFile(from: string, to: string): Promise<void> {
  await ensureDir(path.dirname(to));
  await fs.copyFile(from, to);
}

export async function readFileText(filePath: string): Promise<string> {
  return fs.readFile(filePath, ENCODING_UTF8);
}

export async function writeFileText(filePath: string, content: string): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, ENCODING_UTF8);
}

export async function copyRecursive(from: string, to: string): Promise<void> {
  await fse.copy(from, to);
}

export function normalizeEol(content: string): string {
  return content.replace(/\r?\n/g, os.EOL);
}

export function ensureTrailingNewline(content: string): string {
  return content.endsWith(os.EOL) ? content : content + os.EOL;
}

export async function loadProjectPackageJson(projectRoot: string): Promise<PackageJson> {
  return readJson<PackageJson>(path.join(projectRoot, PACKAGE_JSON_FILENAME));
}
