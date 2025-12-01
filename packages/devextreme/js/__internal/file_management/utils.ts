import { each } from '@js/core/utils/iterator';

export const PATH_SEPARATOR = '/';

export const getFileExtension = (path: string): string => {
  const index = path.lastIndexOf('.');
  return index !== -1 ? path.substring(index) : '';
};

export const getName = (path: string): string => {
  const index = path.lastIndexOf(PATH_SEPARATOR);
  return index !== -1 ? path.substring(index + PATH_SEPARATOR.length) : path;
};

export const getParentPath = (path: string): string => {
  const index = path.lastIndexOf(PATH_SEPARATOR);
  return index !== -1 ? path.substring(0, index) : '';
};

export const getEscapedFileName = (fileName: string): string => fileName.replace(/\/{1,1}/g, '//');

export const pathCombine = (...args: string[]): string => {
  let result = '';

  each(args, (_: number, arg: string): void => {
    if (arg) {
      if (result) {
        result += PATH_SEPARATOR;
      }

      result += arg;
    }
  });

  return result;
};

export const getPathParts = (path?: string, includeFullPath?: boolean): string[] => {
  if (!path || path === '/') {
    return [];
  }
  const result: string[] = [];
  let pathPart = '';

  for (let i = 0; i < path.length; i += 1) {
    let char = path.charAt(i);
    if (char === PATH_SEPARATOR) {
      const nextChar = path.charAt(i + 1);
      if (nextChar !== PATH_SEPARATOR) {
        // eslint-disable-next-line max-depth
        if (pathPart) {
          result.push(pathPart);
          pathPart = '';
        }
        char = nextChar;
      }
      i += 1;
    }
    pathPart += char;
  }

  if (pathPart) {
    result.push(pathPart);
  }

  if (includeFullPath) {
    for (let i = 0; i < result.length; i += 1) {
      result[i] = pathCombine(i === 0 ? '' : result[i - 1], getEscapedFileName(result[i]));
    }
  }

  return result;
};
