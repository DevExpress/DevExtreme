import { readFileText, writeFileText, normalizeEol } from './file-operations';

export interface ConcatOptions {
  sourceFiles: string[];
  header?: string;
  footer?: string;
  extractPattern?: string;
  extractPatternFlags?: string;
  transforms?: { find: string; replace: string; flags?: string }[];
  normalizeLineEndings?: boolean;
  separator?: string;
}

function compileRegex(pattern: string, flags: string): RegExp {
  try {
    return new RegExp(pattern, flags);
  } catch (error) {
    throw new Error(
      `Invalid regex pattern '${pattern}' (flags: '${flags}'): ${(error as Error).message}`,
    );
  }
}

function extractContent(content: string, pattern: string, flags: string): string {
  const regex = compileRegex(pattern, flags);
  const match = regex.exec(content);
  return match?.[1] ?? content;
}

function applyTransforms(
  content: string,
  transforms: { find: string; replace: string; flags?: string }[],
): string {
  return transforms.reduce((result, { find, replace, flags = 'g' }) => {
    return result.replace(compileRegex(find, flags), replace);
  }, content);
}

function applyHeaderFooter(content: string, header?: string, footer?: string): string {
  let result = content;
  if (header) result = header + result;
  if (footer) result = result + footer;
  return result;
}

export async function concatFiles(opts: ConcatOptions): Promise<string> {
  const contents = await Promise.all(
    opts.sourceFiles.map(async (filePath) => {
      const content = await readFileText(filePath);
      if (opts.extractPattern) {
        return extractContent(content, opts.extractPattern, opts.extractPatternFlags ?? 'gm');
      }
      return content;
    }),
  );

  let output = contents.join(opts.separator ?? '\n');

  if (opts.normalizeLineEndings !== false) {
    output = normalizeEol(output);
  }

  output = applyHeaderFooter(output, opts.header, opts.footer);

  if (opts.transforms?.length) {
    output = applyTransforms(output, opts.transforms);
  }

  return output;
}

export async function concatToFile(outputFile: string, opts: ConcatOptions): Promise<void> {
  const content = await concatFiles(opts);
  await writeFileText(outputFile, content);
}
