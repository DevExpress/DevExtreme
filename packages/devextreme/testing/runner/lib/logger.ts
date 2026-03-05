/* eslint-disable @typescript-eslint/no-use-before-define */
import * as fs from 'node:fs';

import { RunnerLogColor, RunnerLogger } from './types';

interface RawLogger {
  filePath: string;
  shouldWriteTimePrefix: boolean;
  writeLine: (text?: string) => void;
  write: (text?: string) => void;
}

export function createRunnerLogger(filePath: string): RunnerLogger {
  const rawLogger = createRawLogger(filePath);

  return {
    write(message, color): void {
      const text = String(message || '');
      rawLogger.write(text);
      process.stdout.write(colorize(text, color));
    },
    writeLine(message, color): void {
      const text = String(message || '');
      rawLogger.writeLine(text);
      process.stdout.write(`${colorize(text, color)}\n`);
    },
    writeError(message: string): void {
      const text = `ERROR: ${message}`;
      rawLogger.writeLine(text);
      process.stderr.write(`${text}\n`);
    },
  };
}

function createRawLogger(filePath: string): RawLogger {
  const logger: RawLogger = {
    filePath,
    shouldWriteTimePrefix: true,
    writeLine(text = '') {
      this.write(`${text || ''}\r\n`);
      this.shouldWriteTimePrefix = true;
    },
    write(text = '') {
      if (!text) {
        return;
      }

      if (this.shouldWriteTimePrefix) {
        this.shouldWriteTimePrefix = false;
        fs.appendFileSync(this.filePath, `${formatLogTime(new Date())}     `, 'utf8');
      }

      fs.appendFileSync(this.filePath, text, 'utf8');
    },
  };

  return logger;
}

function formatLogTime(date: Date): string {
  let hours = date.getHours() % 12;
  if (hours === 0) {
    hours = 12;
  }

  return `${pad2(hours)}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`;
}

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function colorize(text: string, color?: RunnerLogColor): string {
  if (!color) {
    return text;
  }

  const colorCodes: Record<RunnerLogColor, number> = {
    red: 31,
    green: 32,
    yellow: 33,
    white: 37,
  };

  const code = colorCodes[color];

  return `\u001b[${code}m${text}\u001b[0m`;
}
