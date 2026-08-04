import type { MockHandler } from '../types';
import images from '../fixtures/fileManagerImages.json';
import db from '../fixtures/fileManagerDb.json';
import fileSystem from '../fixtures/fileManagerFileSystem.json';

// GET /api/<endpoint>?command=GetDirContents&arguments={"pathInfo":[{"key":…,"name":…},…]}
// RemoteFileSystemProvider loads one directory per request; the fixtures map a
// slash-joined directory path to its contents. Editing commands (CreateDir,
// Rename, Move, Copy, Remove, upload, download) go out as POST and are not
// mocked — the screenshot tests never issue them.

type DirectoryContents = Record<string, unknown[]>;

const requestedPath = (url: string): string => {
  const match = url.match(/[?&]arguments=([^&]*)/);
  if (!match) {
    return '';
  }
  const { pathInfo } = JSON.parse(decodeURIComponent(match[1]));
  return pathInfo.map(({ name }: { name: string }) => name).join('/');
};

const fileSystemHandler = (
  endpoint: string,
  contents: DirectoryContents,
): MockHandler => ({
  // `file-manager-file-system` is a prefix of `file-manager-file-system-images`,
  // so the endpoint has to be anchored at the end of the path.
  matches: (req) => new RegExp(`/api/${endpoint}(?:\\?|$)`, 'i').test(req.url)
    && /[?&]command=GetDirContents\b/i.test(req.url),
  respond: (req) => ({
    success: true,
    errorCode: null,
    errorText: '',
    result: contents[requestedPath(req.url)] ?? [],
  }),
});

export const fileManagerImagesHandler = fileSystemHandler('file-manager-file-system-images', images);
export const fileManagerDbHandler = fileSystemHandler('file-manager-db', db);
export const fileManagerFileSystemHandler = fileSystemHandler('file-manager-file-system', fileSystem);
