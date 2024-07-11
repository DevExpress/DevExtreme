"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMemoizeScrollTo = getMemoizeScrollTo;
function getMemoizeScrollTo(getScrollableInstance) {
  const instance = getScrollableInstance();
  let lastParams = {};
  return function (params) {
    let force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const normalizedParams = {
      top: params.top !== undefined ? Math.ceil(params.top) : undefined,
      left: params.left !== undefined ? Math.ceil(params.left) : undefined
    };
    const isSameParams = normalizedParams.top === lastParams.top && normalizedParams.left === lastParams.left;
    if (!force && isSameParams) {
      return;
    }
    lastParams = normalizedParams;
    instance.scrollTo(params);
  };
}