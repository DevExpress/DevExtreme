import * as fs from 'fs/promises';
import * as path from 'path';
import { glob } from 'glob';

const ENCODING_UTF8 = 'utf-8';
const ERROR_CODE_EXIST = 'EEXIST';

export async function ensureDir(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code === ERROR_CODE_EXIST) {
      return;
    }
    throw error;
  }
}

export async function readJson<T = unknown>(filePath: string): Promise<T> {
  const content = await fs.readFile(filePath, ENCODING_UTF8);
  return JSON.parse(content) as T;
}

export async function writeJson(
  filePath: string,
  data: unknown,
  spaces: number = 2
): Promise<void> {
  const content = JSON.stringify(data, null, spaces);
  await fs.writeFile(filePath, content, ENCODING_UTF8);
}

export async function processFiles(
  pattern: string,
  processor: (filePath: string) => Promise<void>,
  options: { ignore?: string[] } = {}
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

export async function writeFileText(
  filePath: string,
  content: string
): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, ENCODING_UTF8);
}
