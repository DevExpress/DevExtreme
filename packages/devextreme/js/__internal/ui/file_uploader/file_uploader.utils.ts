/* eslint-disable spellcheck/spell-checker */

type IconName = 'image' | 'video' | 'music' | 'pdffile' | 'textdocument' | 'exportxlsx' | 'folder' | 'file';

const EXTENTIONS_MAP: Record<string, IconName> = {
  jpg: 'image',
  jpeg: 'image',
  png: 'image',
  gif: 'image',
  bmp: 'image',
  webp: 'image',
  mp4: 'video',
  mov: 'video',
  avi: 'video',
  webm: 'video',
  mkv: 'video',
  mp3: 'music',
  wav: 'music',
  ogg: 'music',
  m4a: 'music',
  flac: 'music',
  doc: 'textdocument',
  docx: 'textdocument',
  txt: 'textdocument',
  rtf: 'textdocument',
  md: 'textdocument',
  xls: 'exportxlsx',
  xlsx: 'exportxlsx',
  csv: 'exportxlsx',
  ods: 'exportxlsx',
  zip: 'folder',
  rar: 'folder',
  '7z': 'folder',
  tar: 'folder',
  gz: 'folder',
  pdf: 'pdffile',
};

const DEFAULT_ICON: IconName = 'file';

export const getFileIconName = (filename = ''): IconName => {
  const lastDotIndex = filename.lastIndexOf('.');

  if (lastDotIndex === -1 || lastDotIndex === filename.length - 1) {
    return DEFAULT_ICON;
  }

  const extension = filename.slice(lastDotIndex + 1).toLowerCase();
  return EXTENTIONS_MAP[extension] || DEFAULT_ICON;
};
