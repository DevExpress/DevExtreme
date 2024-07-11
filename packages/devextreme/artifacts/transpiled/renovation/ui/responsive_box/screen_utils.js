"use strict";

exports.convertToScreenSizeQualifier = void 0;
const convertToScreenSizeQualifier = width => {
  if (width < 768) {
    return 'xs';
  }
  if (width < 992) {
    return 'sm';
  }
  if (width < 1200) {
    return 'md';
  }
  return 'lg';
};
exports.convertToScreenSizeQualifier = convertToScreenSizeQualifier;