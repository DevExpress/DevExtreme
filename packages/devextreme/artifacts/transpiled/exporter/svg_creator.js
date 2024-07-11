"use strict";

exports.getData = getData;
exports.svgCreator = void 0;
var _renderer = _interopRequireDefault(require("../core/renderer"));
var _ajax = _interopRequireDefault(require("../core/utils/ajax"));
var _window = require("../core/utils/window");
var _type = require("../core/utils/type");
var _iterator = require("../core/utils/iterator");
var _svg = require("../core/utils/svg");
var _deferred = require("../core/utils/deferred");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const window = (0, _window.getWindow)();
const svgCreator = exports.svgCreator = {
  _markup: '',
  _imageArray: {},
  _imageDeferreds: [],
  _getBinaryFile: function (src, callback) {
    _ajax.default.sendRequest({
      url: src,
      method: 'GET',
      responseType: 'arraybuffer'
    }).done(callback).fail(function () {
      callback(false);
    });
  },
  _loadImages: function () {
    const that = this;
    (0, _iterator.each)(that._imageArray, function (src) {
      const deferred = new _deferred.Deferred();
      that._imageDeferreds.push(deferred);
      that._getBinaryFile(src, function (response) {
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
        that._imageArray[src] = 'data:image/png;base64,' + window.btoa(binary);
        deferred.resolve();
      });
    });
  },
  _parseImages: function (element) {
    let href;
    const that = this;
    if (element.tagName === 'image') {
      href = (0, _renderer.default)(element).attr('href') || (0, _renderer.default)(element).attr('xlink:href');
      if (!that._imageArray[href]) {
        that._imageArray[href] = '';
      }
    }
    (0, _iterator.each)(element.childNodes, function (_, element) {
      that._parseImages(element);
    });
  },
  _prepareImages: function (svgElem) {
    this._parseImages(svgElem);
    this._loadImages();
    return _deferred.when.apply(_renderer.default, this._imageDeferreds);
  },
  getData: function (data, options) {
    let markup;
    const that = this;
    const xmlVersion = '<?xml version="1.0" encoding="UTF-8" standalone="yes" ?>';
    const svgElem = (0, _svg.getSvgElement)(data);
    const $svgObject = (0, _renderer.default)(svgElem);
    $svgObject.find(`[${_svg.HIDDEN_FOR_EXPORT}]`).remove();
    markup = xmlVersion + (0, _svg.getSvgMarkup)($svgObject.get(0), options.backgroundColor);
    return that._prepareImages(svgElem).then(() => {
      (0, _iterator.each)(that._imageArray, function (href, dataURI) {
        const regexpString = `href=['|"]${href}['|"]`;
        markup = markup.replace(new RegExp(regexpString, 'gi'), `href="${dataURI}"`);
      });
      return (0, _type.isFunction)(window.Blob) ? that._getBlob(markup) : that._getBase64(markup);
    });
  },
  _getBlob: function (markup) {
    return new window.Blob([markup], {
      type: 'image/svg+xml'
    });
  },
  _getBase64: function (markup) {
    return window.btoa(markup);
  }
};
function getData(data, options) {
  return svgCreator.getData(data, options);
}