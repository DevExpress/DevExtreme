import messageLocalization from '@js/common/core/localization/message';
import $ from '@js/core/renderer';
import { camelize } from '@js/core/utils/inflector';

export const ICON_CLASS = 'dx-icon';
const SVG_ICON_CLASS = 'dx-svg-icon';

const NOT_URL_REGEXP = /^(?!(?:https?:\/\/)|(?:ftp:\/\/)|(?:www\.))[^\s]+$/;
const FILE_NAME_REGEXP = /.+\/([^.]+)\..+$/;
const SVG_TITLE_REGEXP = /<title>(.*?)<\/title>/;

export const getImageSourceType = (source) => {
  if (!source || typeof source !== 'string') {
    return false;
  }

  if (/^\s*<svg[^>]*>(.|\r?\n)*?<\/svg>\s*$/i.test(source)) {
    return 'svg';
  }

  if (/data:.*base64|\.|[^<\s]\/{1,1}/.test(source)) {
    return 'image';
  }

  if (/^[\w-_]+$/.test(source)) {
    return 'dxIcon';
  }

  if (/^\s?([\w-_:]\s?)+$/.test(source)) {
    return 'fontIcon';
  }

  return false;
};

export const getImageContainer = (source) => {
  switch (getImageSourceType(source)) {
    case 'image':
      return $('<img>').attr('src', source).addClass(ICON_CLASS);
    case 'fontIcon':
      return $('<i>').addClass(`${ICON_CLASS} ${source}`);
    case 'dxIcon':
      return $('<i>').addClass(`${ICON_CLASS} ${ICON_CLASS}-${source}`);
    case 'svg':
      return $('<i>').addClass(`${ICON_CLASS} ${SVG_ICON_CLASS}`).append(source);
    default:
      return null;
  }
};

export const getImageAriaLabel = (source: string): string => {
  switch (getImageSourceType(source)) {
    case 'image': {
      const isPathToImage = !source.includes('base64') && NOT_URL_REGEXP.test(source);

      return isPathToImage ? source.replace(FILE_NAME_REGEXP, '$1') : '';
    }
    case 'dxIcon':
      return messageLocalization.format(camelize(source, true)) || source;
    case 'fontIcon':
      return source;
    case 'svg':
      return SVG_TITLE_REGEXP.exec(source)?.[1] ?? '';
    default:
      return '';
  }
};
