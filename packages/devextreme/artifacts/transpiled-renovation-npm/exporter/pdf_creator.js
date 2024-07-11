"use strict";

exports.getData = getData;
var _version = require("../core/version");
var _window = require("../core/utils/window");
var _image_creator = require("./image_creator");
var _type = require("../core/utils/type");
var _extend = require("../core/utils/extend");
const window = (0, _window.getWindow)();
const mainPageTemplate = '%PDF-1.3\r\n2 0 obj\r\n<</ProcSet[/PDF/ImageB/ImageC/ImageI]/XObject<</I0 5 0 R>>>>\r\nendobj\r\n4 0 obj\r\n<</Type/Pages/Kids[1 0 R]/Count 1>>\r\nendobj\r\n7 0 obj\r\n<</OpenAction[1 0 R /FitH null]/Type/Catalog/Pages 4 0 R/PageLayout/OneColumn>>\r\nendobj\r\n1 0 obj\r\n<</Type/Page/Resources 2 0 R/MediaBox[0 0 _width_ _height_]/Contents 3 0 R/Parent 4 0 R>>\r\nendobj\r\n';
const contentTemplate = '3 0 obj\r\n<</Length 52>>stream\r\n0.20 w\n0 G\nq _width_ 0 0 _height_ 0.00 0.00 cm /I0 Do Q\r\nendstream\r\nendobj\r\n';
const infoTemplate = '6 0 obj\r\n<</CreationDate _date_/Producer(DevExtreme _version_)>>\r\nendobj\r\n';
const imageStartTemplate = '5 0 obj\r\n<</Type/XObject/Subtype/Image/Width _width_/Height _height_/ColorSpace/DeviceRGB/BitsPerComponent 8/Filter/DCTDecode/Length _length_>>stream\r\n';
const imageEndTemplate = '\r\nendstream\r\nendobj\r\n';
const trailerTemplate = 'trailer\r\n<<\r\n/Size 8\r\n/Root 7 0 R\r\n/Info 6 0 R\r\n>>\r\nstartxref\r\n_length_\r\n%%EOF';
const xrefTemplate = 'xref\r\n0 8\r\n0000000000 65535 f\r\n0000000241 00000 n\r\n0000000010 00000 n\r\n_main_ 00000 n\r\n0000000089 00000 n\r\n_image_ 00000 n\r\n_info_ 00000 n\r\n0000000143 00000 n\r\n';
const pad = function (str, len) {
  return str.length < len ? pad('0' + str, len) : str;
};
let composePdfString = function (imageString, options, curDate) {
  const margin = (options.margin || 0) * 2;
  let {
    width,
    height
  } = (0, _image_creator.calcScaledInfo)(options.width, options.height);
  width += margin;
  height += margin;
  const widthPt = (width * 0.75).toFixed(2);
  const heightPt = (height * 0.75).toFixed(2);
  const flooredWidth = Math.floor(width);
  const flooredHeight = Math.floor(height);
  const mainPage = mainPageTemplate.replace('_width_', widthPt).replace('_height_', heightPt);
  const content = contentTemplate.replace('_width_', widthPt).replace('_height_', heightPt);
  const info = infoTemplate.replace('_date_', curDate).replace('_version_', _version.version);
  const image = imageStartTemplate.replace('_width_', flooredWidth).replace('_height_', flooredHeight).replace('_length_', imageString.length) + imageString + imageEndTemplate;
  const xref = getXref(mainPage.length, content.length, info.length);
  const mainContent = mainPage + content + info + image;
  const trailer = trailerTemplate.replace('_length_', mainContent.length);
  return mainContent + xref + trailer;
};
function getXref(mainPageLength, contentLength, infoLength) {
  return xrefTemplate.replace('_main_', pad(mainPageLength + '', 10)).replace('_info_', pad(mainPageLength + contentLength + '', 10)).replace('_image_', pad(mainPageLength + contentLength + infoLength + '', 10));
}
let getCurDate = function () {
  return new Date();
};
let getBlob = function (binaryData) {
  let i = 0;
  const dataArray = new Uint8Array(binaryData.length);
  for (; i < binaryData.length; i++) {
    dataArray[i] = binaryData.charCodeAt(i);
  }
  return new window.Blob([dataArray.buffer], {
    type: 'application/pdf'
  });
};
let getBase64 = function (binaryData) {
  return window.btoa(binaryData);
};
function getTwoDigitValue(value) {
  const stringValue = value.toString();
  if (stringValue.length === 1) {
    return `0${value}`;
  }
  return value;
}
function convertToPdfDateFormat(date) {
  const dateUnits = [date.getUTCFullYear(), getTwoDigitValue(date.getUTCMonth()), getTwoDigitValue(date.getUTCDate()), getTwoDigitValue(date.getUTCHours()), getTwoDigitValue(date.getUTCMinutes()), getTwoDigitValue(date.getUTCSeconds())];
  return `(D:${dateUnits.join('')}Z00'00')`;
}
function getData(data, options) {
  return _image_creator.imageCreator.getImageData(data, (0, _extend.extend)({}, options, {
    format: 'JPEG'
  })).then(imageString => {
    const binaryData = composePdfString(imageString, options, convertToPdfDateFormat(getCurDate()));
    const pdfData = (0, _type.isFunction)(window.Blob) ? getBlob(binaryData) : getBase64(binaryData);
    return pdfData;
  });
}