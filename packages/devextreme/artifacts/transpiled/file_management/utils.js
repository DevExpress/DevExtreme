"use strict";

exports.pathCombine = exports.getPathParts = exports.getParentPath = exports.getName = exports.getFileExtension = exports.getEscapedFileName = exports.PATH_SEPARATOR = void 0;
var _iterator = require("../core/utils/iterator");
const PATH_SEPARATOR = exports.PATH_SEPARATOR = '/';
const getFileExtension = path => {
  const index = path.lastIndexOf('.');
  return index !== -1 ? path.substr(index) : '';
};
exports.getFileExtension = getFileExtension;
const getName = path => {
  const index = path.lastIndexOf(PATH_SEPARATOR);
  return index !== -1 ? path.substr(index + PATH_SEPARATOR.length) : path;
};
exports.getName = getName;
const getParentPath = path => {
  const index = path.lastIndexOf(PATH_SEPARATOR);
  return index !== -1 ? path.substr(0, index) : '';
};
exports.getParentPath = getParentPath;
const getPathParts = (path, includeFullPath) => {
  if (!path || path === '/') {
    return [];
  }
  const result = [];
  let pathPart = '';
  for (let i = 0; i < path.length; i++) {
    let char = path.charAt(i);
    if (char === PATH_SEPARATOR) {
      const nextChar = path.charAt(i + 1);
      if (nextChar !== PATH_SEPARATOR) {
        if (pathPart) {
          result.push(pathPart);
          pathPart = '';
        }
        char = nextChar;
      }
      i++;
    }
    pathPart += char;
  }
  if (pathPart) {
    result.push(pathPart);
  }
  if (includeFullPath) {
    for (let i = 0; i < result.length; i++) {
      result[i] = pathCombine(i === 0 ? '' : result[i - 1], getEscapedFileName(result[i]));
    }
  }
  return result;
};
exports.getPathParts = getPathParts;
const getEscapedFileName = function (fileName) {
  return fileName.replace(/\/{1,1}/g, '//');
};
exports.getEscapedFileName = getEscapedFileName;
const pathCombine = function () {
  let result = '';
  (0, _iterator.each)(arguments, (_, arg) => {
    if (arg) {
      if (result) {
        result += PATH_SEPARATOR;
      }
      result += arg;
    }
  });
  return result;
};
exports.pathCombine = pathCombine;