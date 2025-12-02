/* eslint-disable spellcheck/spell-checker */

import messageLocalization from '@js/common/core/localization/message';

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

export const getFileSize = (sizeInBytes: number): string => {
  const labels = [
    messageLocalization.format('dxFileUploader-bytes'),
    messageLocalization.format('dxFileUploader-kb'),
    messageLocalization.format('dxFileUploader-Mb'),
    messageLocalization.format('dxFileUploader-Gb'),
  ];

  const count = labels.length - 1;

  let value = sizeInBytes;
  let i = 0;

  while (i < count && value >= 1024) {
    value /= 1024;
    i += 1;
  }

  return `${Math.round(value)} ${labels[i]}`;
};
