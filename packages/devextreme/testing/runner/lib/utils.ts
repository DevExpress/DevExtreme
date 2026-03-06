import * as fs from 'node:fs';
import { IncomingMessage } from 'node:http';
import * as path from 'node:path';

import { PortsMap } from './types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isPortValue(value: unknown): value is number | string {
  return typeof value === 'number' || typeof value === 'string';
}

export function jsonString(value: unknown): string {
  return JSON.stringify(value);
}

export function escapeHtml(value: unknown): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function escapeXmlText(value: unknown): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function escapeXmlAttr(value: unknown): string {
  return escapeXmlText(value)
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function loadPorts(filePath: string): PortsMap {
  const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8')) as unknown;

  if (!isRecord(parsed)) {
    throw new Error(`Invalid ports definition: ${filePath}`);
  }

  if (!isPortValue(parsed.qunit) || !isPortValue(parsed['vectormap-utils-tester'])) {
    throw new Error(`Required ports are missing in ${filePath}`);
  }

  const portsMap: PortsMap = {
    qunit: parsed.qunit,
    'vectormap-utils-tester': parsed['vectormap-utils-tester'],
  };

  Object.entries(parsed).forEach(([key, value]) => {
    if (!isPortValue(value)) {
      throw new Error(`Invalid port value for "${key}" in ${filePath}`);
    }

    portsMap[key] = value;
  });

  return portsMap;
}

export function safeReadFile(filePath: string): string {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

export function parseBoolean(value: unknown): boolean {
  return String(value).toLowerCase() === 'true';
}

export function parseNumber(value: unknown): number {
  const number = Number(value);
  return Number.isNaN(number) ? 0 : number;
}

export function splitCommaList(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function safeDecodeURIComponent(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

export function formatDateForSuiteTimestamp(date: Date): string {
  return `${[
    date.getFullYear(),
    pad2(date.getMonth() + 1),
    pad2(date.getDate()),
  ].join('-')}T${[
    pad2(date.getHours()),
    pad2(date.getMinutes()),
    pad2(date.getSeconds()),
  ].join(':')}`;
}

export function isContinuousIntegration(): boolean {
  return Boolean(process.env.CCNetWorkingDirectory || process.env.DEVEXTREME_TEST_CI);
}

export function resolveNodePath(): string {
  if (process.env.CCNetWorkingDirectory) {
    const customPath = path.join(process.env.CCNetWorkingDirectory, 'node', 'node.exe');
    if (fs.existsSync(customPath)) {
      return customPath;
    }
  }

  return 'node';
}

export function readBodyText(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    req.on('data', (chunk: Buffer | string) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });

    req.on('end', () => {
      resolve(Buffer.concat(chunks).toString('utf8'));
    });

    req.on('error', reject);
  });
}

export async function readFormBody(req: IncomingMessage): Promise<Record<string, string>> {
  const body = await readBodyText(req);
  return Object.fromEntries(new URLSearchParams(body));
}

export function getCacheBuster(searchParams: URLSearchParams): string {
  if (searchParams.has('DX_HTTP_CACHE')) {
    const value = searchParams.get('DX_HTTP_CACHE') ?? '';
    return `DX_HTTP_CACHE=${encodeURIComponent(value)}`;
  }

  return '';
}

export function contentWithCacheBuster(contentPath: string, cacheBuster: string): string {
  if (!cacheBuster) {
    return contentPath;
  }

  return `${contentPath}${contentPath.includes('?') ? '&' : '?'}${cacheBuster}`;
}

export function normalizeNumber(value: unknown): number {
  const number = Number(value);
  if (Number.isNaN(number)) {
    return 0;
  }

  return number;
}
