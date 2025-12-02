/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-dynamic-delete */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import $ from '@js/core/renderer';
import ajax from '@js/core/utils/ajax';
import { Deferred, when } from '@js/core/utils/deferred';
import { each } from '@js/core/utils/iterator';
import { isFunction } from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';
import svgUtils from '@ts/core/utils/m_svg';

const window = getWindow();

export const svgCreator = {
  _markup: '',
  _imageArray: {},
  _imageDeferreds: [],

  _getBinaryFile(src, callback) {
    ajax.sendRequest({
      url: src,
      method: 'GET',
      responseType: 'arraybuffer',
    }).done(callback).fail(() => {
      callback(false);
    });
  },

  _loadImages() {
    const that = this;

    each(that._imageArray, (src) => {
      const deferred = Deferred();

      that._imageDeferreds.push(deferred);
      that._getBinaryFile(src, (response) => {
        if (!response) {
          delete that._imageArray[src]; // ToDo Warning
          deferred.resolve();
          return;
        }

        let i;
        let binary = '';
        const bytes = new Uint8Array(response);
        const length = bytes.byteLength;

        for (i = 0; i < length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        that._imageArray[src] = `data:image/png;base64,${window.btoa(binary)}`;
        deferred.resolve();
      });
    });
  },

  _parseImages(element) {
    let href;
    const that = this;

    if (element.tagName === 'image') {
      href = $(element).attr('href') || $(element).attr('xlink:href');
      if (!that._imageArray[href]) {
        that._imageArray[href] = '';
      }
    }

    each(element.childNodes, (_, element) => {
      that._parseImages(element);
    });
  },

  _prepareImages(svgElem) {
    this._parseImages(svgElem);
    this._loadImages();

    return when.apply($, this._imageDeferreds);
  },

  getData(data, options) {
    let markup;
    const that = this;
    const xmlVersion = '<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>';
    const svgElem = svgUtils.getSvgElement(data);
    const $svgObject = $(svgElem);
    $svgObject.find(`[${svgUtils.HIDDEN_FOR_EXPORT}]`).remove();

    markup = xmlVersion + svgUtils.getSvgMarkup($svgObject.get(0), options.backgroundColor);

    return that._prepareImages(svgElem).then(() => {
      each(that._imageArray, (href, dataURI) => {
        const regexpString = `href=['|"]${href}['|"]`;
        markup = markup.replace(new RegExp(regexpString, 'gi'), `href="${dataURI}"`);
      });

      // @ts-expect-error
      return isFunction(window.Blob) ? that._getBlob(markup) : that._getBase64(markup);
    });
  },

  _getBlob(markup) {
    // @ts-expect-error
    return new window.Blob([markup], { type: 'image/svg+xml' });
  },

  _getBase64(markup) {
    return window.btoa(markup);
  },
};

export function getData(data, options) {
  return svgCreator.getData(data, options);
}
